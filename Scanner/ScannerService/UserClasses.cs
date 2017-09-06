using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;

namespace ScannerService
{
  public enum WTS_INFO_CLASS
  {
    WTSInitialProgram,
    WTSApplicationName,
    WTSWorkingDirectory,
    WTSOEMId,
    WTSSessionId,
    WTSUserName,
    WTSWinStationName,
    WTSDomainName,
    WTSConnectState,
    WTSClientBuildNumber,
    WTSClientName,
    WTSClientDirectory,
    WTSClientProductId,
    WTSClientHardwareId,
    WTSClientAddress,
    WTSClientDisplay,
    WTSClientProtocolType,
    WTSIdleTime,
    WTSLogonTime,
    WTSIncomingBytes,
    WTSOutgoingBytes,
    WTSIncomingFrames,
    WTSOutgoingFrames,
    WTSClientInfo,
    WTSSessionInfo
  }
  
  public static class Status
  {
    public static Byte Online
    {
      get { return 0x0; }
    }

    public static Byte Offline
    {
      get { return 0x1; }
    }

    public static Byte SignedIn
    {
      get { return 0x2; }
    }

    public static Byte SignedOff
    {
      get { return 0x3; }
    }
  }

  public static class Session
  {
    [DllImport("Kernel32.dll")]
    public static extern uint WTSGetActiveConsoleSessionId();

    [DllImport("Wtsapi32.dll")]
    public static extern bool WTSQuerySessionInformation(IntPtr hServer, Int32 sessionId, WTS_INFO_CLASS wtsInfoClass, out IntPtr ppBuffer, out Int32 pBytesReturned);

    [DllImport("Wtsapi32.dll")]
    public static extern void WTSFreeMemory(IntPtr pointer);

    private static readonly Dictionary<Int32, User> User = new Dictionary<Int32, User>();

    public static bool Add(Int32 sessionId)
    {
      IntPtr buffer;
      int length;

      var name = String.Empty;
      var domain = String.Empty;

      if (WTSQuerySessionInformation(IntPtr.Zero, sessionId, WTS_INFO_CLASS.WTSUserName, out buffer, out length) && length > 1)
      {
        name = Marshal.PtrToStringAnsi(buffer);
        WTSFreeMemory(buffer);
        if (WTSQuerySessionInformation(IntPtr.Zero, sessionId, WTS_INFO_CLASS.WTSDomainName, out buffer, out length) && length > 1)
        {
          domain = Marshal.PtrToStringAnsi(buffer);
          WTSFreeMemory(buffer);
        }
      }

      if (name == null || name.Length <= 0)
      {
        return false;
      }

      User.Add(sessionId, new User(name, domain));

      return true;
    }

    public static bool Remove(Int32 sessionId)
    {
      return User.Remove(sessionId);
    }

    public static User Get(Int32 sessionId)
    {
      if (User.ContainsKey(sessionId))
      {
        return User[sessionId];
      }

      return Add(sessionId) ? Get(sessionId) : null;
    }

    public static UInt32 GetActiveConsoleSessionId()
    {
      return WTSGetActiveConsoleSessionId();
    }
  }

  public class AvailabilityChangedEventArgs : EventArgs
  {
    public bool Available { get; set; }

    public AvailabilityChangedEventArgs(bool isAvailable)
    {
      Available = isAvailable;
    }
  }

  public class User
  {
    private readonly String _name;
    private readonly String _domain;
    private bool _signedIn;
    public static EventHandler<AvailabilityChangedEventArgs> AvailabilityChanged;

    public User(String name, String domain)
    {
      _name = name;
      _domain = domain;
    }

    public String Name
    {
      get { return _name; }
    }

    public String Domain
    {
      get { return _domain; }
    }
    
    public bool IsSignedIn
    {
      get { return _signedIn; }
      set
      {
        if (_signedIn == value) return;

        _signedIn = value;

        OnAvailabilityChanged(this, new AvailabilityChangedEventArgs(IsSignedIn));
      }
    }

    protected void OnAvailabilityChanged(object sender, AvailabilityChangedEventArgs e)
    {
      AvailabilityChanged?.Invoke(this, e);
    }
  }
}