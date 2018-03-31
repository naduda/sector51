using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;

namespace ScannerService
{
  enum WTS_INFO_CLASS
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
  
  static class Status
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

  static class Session
  {
    [DllImport("Kernel32.dll")]
    static extern uint WTSGetActiveConsoleSessionId();

    [DllImport("Wtsapi32.dll")]
    static extern bool WTSQuerySessionInformation(IntPtr hServer, Int32 sessionId, WTS_INFO_CLASS wtsInfoClass, out IntPtr ppBuffer, out Int32 pBytesReturned);

    [DllImport("Wtsapi32.dll")]
    static extern void WTSFreeMemory(IntPtr pointer);

    private static readonly Dictionary<Int32, User> users = new Dictionary<Int32, User>();

    static bool Add(Int32 sessionId)
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

      users.Add(sessionId, new User(name, domain));
      return true;
    }

    static bool Remove(Int32 sessionId)
    {
      return users.Remove(sessionId);
    }

    static User Get(Int32 sessionId)
    {
      if (users.ContainsKey(sessionId))
      {
        return users[sessionId];
      }

      return Add(sessionId) ? Get(sessionId) : null;
    }

    static UInt32 GetActiveConsoleSessionId()
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
}
