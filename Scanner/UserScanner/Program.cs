using NLog;
using System;
using System.Diagnostics;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace UserScanner
{
  class Program
  {
    private static Logger logger = LogManager.GetCurrentClassLogger();
    private delegate IntPtr LowLevelKeyboardProc(int nCode, IntPtr wParam, IntPtr lParam);

    [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern IntPtr SetWindowsHookEx(int idHook, LowLevelKeyboardProc lpfn, IntPtr hMod, uint dwThreadId);

    [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool UnhookWindowsHookEx(IntPtr hhk);

    [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern IntPtr CallNextHookEx(IntPtr hhk, int nCode, IntPtr wParam, IntPtr lParam);

    [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern IntPtr GetModuleHandle(string lpModuleName);

    private const int WH_KEYBOARD_LL = 13;
    private const int WM_KEYDOWN = 0x0100;
    private static LowLevelKeyboardProc _proc = HookCallback;
    private static IntPtr _hookID = IntPtr.Zero;
    private static string message = string.Empty;

    private static IntPtr SetHook(LowLevelKeyboardProc proc)
    {
      using (Process curProcess = Process.GetCurrentProcess())
      using (ProcessModule curModule = curProcess.MainModule)
      {
        return SetWindowsHookEx(WH_KEYBOARD_LL, proc,
            GetModuleHandle(curModule.ModuleName), 0);
      }
    }
    
    static void Main(string[] args)
    {
      _hookID = SetHook(_proc);
      Application.Run();
      UnhookWindowsHookEx(_hookID);
    }

    private static char[] nums = new char[] { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' };
    private static IntPtr HookCallback(int nCode, IntPtr wParam, IntPtr lParam)
    {
      if (nCode >= 0 && wParam == (IntPtr)WM_KEYDOWN)
      {
        var vkCode = Marshal.ReadInt32(lParam);
        var kc = new KeysConverter();
        var keyChar = kc.ConvertToString(vkCode);
        if ((Keys)vkCode == Keys.Enter)
        {
          if (message.Length > 0) logger.Info("Hooked message: {0}", message);
          message = "";
        }
        else if (nums.Contains(keyChar[0]))
        {
          message += keyChar;
        }
      }
      return CallNextHookEx(_hookID, nCode, wParam, lParam);
    }
  }
}
