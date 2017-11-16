using System;
using System.Diagnostics;
using System.Management;
using System.Runtime.InteropServices;
using System.Linq;
using NLog;

namespace ScannerService
{
  #region structs
  [StructLayout(LayoutKind.Sequential)]
  internal struct PROCESS_INFORMATION
  {
    public IntPtr hProcess;
    public IntPtr hThread;
    public uint dwProcessId;
    public uint dwThreadId;
  }

  [StructLayout(LayoutKind.Sequential)]
  internal struct SECURITY_ATTRIBUTES
  {
    public uint nLength;
    public IntPtr lpSecurityDescriptor;
    public bool bInheritHandle;
  }

  [StructLayout(LayoutKind.Sequential)]
  public struct STARTUPINFO
  {
    public uint cb;
    public string lpReserved;
    public string lpDesktop;
    public string lpTitle;
    public uint dwX;
    public uint dwY;
    public uint dwXSize;
    public uint dwYSize;
    public uint dwXCountChars;
    public uint dwYCountChars;
    public uint dwFillAttribute;
    public uint dwFlags;
    public short wShowWindow;
    public short cbReserved2;
    public IntPtr lpReserved2;
    public IntPtr hStdInput;
    public IntPtr hStdOutput;
    public IntPtr hStdError;
  }

  internal enum SECURITY_IMPERSONATION_LEVEL
  {
    SecurityAnonymous,
    SecurityIdentification,
    SecurityImpersonation,
    SecurityDelegation
  }

  internal enum TOKEN_TYPE
  {
    TokenPrimary = 1,
    TokenImpersonation
  }
  #endregion

  public class ProcessAsCurrentUser
  {
    private static Logger logger = LogManager.GetCurrentClassLogger();

    #region WinAPI
    [DllImport("advapi32.dll", SetLastError = true)]
    private static extern bool CreateProcessAsUser(
        IntPtr hToken,
        string lpApplicationName,
        string lpCommandLine,
        ref SECURITY_ATTRIBUTES lpProcessAttributes,
        ref SECURITY_ATTRIBUTES lpThreadAttributes,
        bool bInheritHandles,
        uint dwCreationFlags,
        IntPtr lpEnvironment,
        string lpCurrentDirectory,
        ref STARTUPINFO lpStartupInfo,
        out PROCESS_INFORMATION lpProcessInformation);

    [DllImport("advapi32.dll", EntryPoint = "DuplicateTokenEx", SetLastError = true)]
    private static extern bool DuplicateTokenEx(
        IntPtr hExistingToken,
        uint dwDesiredAccess,
        ref SECURITY_ATTRIBUTES lpThreadAttributes,
        Int32 ImpersonationLevel,
        Int32 dwTokenType,
        ref IntPtr phNewToken);

    [DllImport("advapi32.dll", SetLastError = true)]
    private static extern bool OpenProcessToken(IntPtr ProcessHandle, UInt32 DesiredAccess, ref IntPtr TokenHandle);

    [DllImport("userenv.dll", SetLastError = true)]
    private static extern bool CreateEnvironmentBlock(ref IntPtr lpEnvironment, IntPtr hToken, bool bInherit);

    [DllImport("userenv.dll", SetLastError = true)]
    private static extern bool DestroyEnvironmentBlock(IntPtr lpEnvironment);

    [DllImport("kernel32.dll", SetLastError = true)]
    private static extern bool CloseHandle(IntPtr hObject);

    private const short SW_SHOW = 5;
    private const uint TOKEN_QUERY = 0x0008;
    private const uint TOKEN_DUPLICATE = 0x0002;
    private const uint TOKEN_ASSIGN_PRIMARY = 0x0001;
    private const int GENERIC_ALL_ACCESS = 0x10000000;
    private const int STARTF_USESHOWWINDOW = 0x00000001;
    private const int STARTF_FORCEONFEEDBACK = 0x00000040;
    private const uint CREATE_UNICODE_ENVIRONMENT = 0x00000400;
    #endregion

    private static bool LaunchProcessAsUser(string cmdLine, IntPtr token, IntPtr envBlock)
    {
      var result = false;
      var pi = new PROCESS_INFORMATION();
      var saProcess = new SECURITY_ATTRIBUTES();
      var saThread = new SECURITY_ATTRIBUTES();
      var si = new STARTUPINFO();

      saProcess.nLength = (uint)Marshal.SizeOf(saProcess);
      saThread.nLength = (uint)Marshal.SizeOf(saThread);
      si.cb = (uint)Marshal.SizeOf(si);
      si.lpDesktop = @"WinSta0\Default";
      si.dwFlags = STARTF_USESHOWWINDOW | STARTF_FORCEONFEEDBACK;
      si.wShowWindow = SW_SHOW;

      result = CreateProcessAsUser(
          token,
          null,
          cmdLine,
          ref saProcess,
          ref saThread,
          false,
          CREATE_UNICODE_ENVIRONMENT,
          envBlock,
          null,
          ref si,
          out pi);

      if (result == false)
      {
        var error = Marshal.GetLastWin32Error();
        var message = string.Format("CreateProcessAsUser Error: {0}", error);
        logger.Debug(message);
      }

      return result;
    }

    private static IntPtr GetPrimaryToken(int processId)
    {
      var token = IntPtr.Zero;
      var primaryToken = IntPtr.Zero;
      var retVal = false;
      Process p = null;

      try
      {
        p = Process.GetProcessById(processId);
      }
      catch (ArgumentException)
      {
        var details = string.Format("ProcessID {0} Not Available", processId);
        logger.Debug(details);
        throw;
      }

      //Gets impersonation token 
      retVal = OpenProcessToken(p.Handle, TOKEN_DUPLICATE, ref token);
      if (retVal == true)
      {
        var sa = new SECURITY_ATTRIBUTES();
        sa.nLength = (uint)Marshal.SizeOf(sa);

        //Convert the impersonation token into Primary token 
        retVal = DuplicateTokenEx(
            token,
            TOKEN_ASSIGN_PRIMARY | TOKEN_DUPLICATE | TOKEN_QUERY,
            ref sa,
            (int)SECURITY_IMPERSONATION_LEVEL.SecurityIdentification,
            (int)TOKEN_TYPE.TokenPrimary,
            ref primaryToken);

        //Close the Token that was previously opened. 
        CloseHandle(token);
        if (retVal == false)
        {
          var message = string.Format("DuplicateTokenEx Error: {0}", Marshal.GetLastWin32Error());
          logger.Debug(message);
        }
      }
      else
      {
        var message = String.Format("OpenProcessToken Error: {0}", Marshal.GetLastWin32Error());
        logger.Debug(message);
      }

      //We'll Close this token after it is used. 
      return primaryToken;
    }

    private static IntPtr GetEnvironmentBlock(IntPtr token)
    {
      var envBlock = IntPtr.Zero;
      var retVal = CreateEnvironmentBlock(ref envBlock, token, false);
      if (retVal == false)
      {
        var message = string.Format("CreateEnvironmentBlock Error: {0}", Marshal.GetLastWin32Error());
        logger.Debug(message);
      }
      return envBlock;
    }

    public static string GetLoggedInUserName()
    {
      var searcher = new ManagementObjectSearcher("SELECT UserName FROM Win32_ComputerSystem");
      var collection = searcher.Get();
      return (string)collection.Cast<ManagementBaseObject>().First()["UserName"];
    }
    
    public static bool Launch(string appCmdLine /*,int processId*/)
    {
      var ret = false;
      var ps = Process.GetProcessesByName("explorer");
      var processId = -1;

      if (ps.Length > 0)
      {
        processId = ps[0].Id;
      }

      if (processId > 1)
      {
        var token = GetPrimaryToken(processId);

        if (token != IntPtr.Zero)
        {
          var envBlock = GetEnvironmentBlock(token);
          ret = LaunchProcessAsUser(appCmdLine, token, envBlock);
          if (envBlock != IntPtr.Zero)
            DestroyEnvironmentBlock(envBlock);

          CloseHandle(token);
        }
      }
      return ret;
    }
  }
}
