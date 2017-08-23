using System;
using System.Diagnostics;
using System.Windows.Forms;
using System.Runtime.InteropServices;
using System.Linq;
using Npgsql;
using System.Collections.Generic;
using System.IO;

namespace Scanner
{
  static class Program
  {
    private const int WH_KEYBOARD_LL = 13;
    private const int WM_KEYDOWN = 0x0100;
    private static LowLevelKeyboardProc _proc = HookCallback;
    private static IntPtr _hookID = IntPtr.Zero;
    private static Dictionary<string, string> props;
    private const string connectionString = "Host={3};Port={2};Username=postgres;Password={0};Database={1}";
    private static string message;

    [STAThread]
    public static void Main()
    {
      props = ReadSettingsFromFile();
      foreach (var k in props.Keys)
        Console.WriteLine(k + " / " + props[k]);
      _hookID = SetHook(_proc);
      Application.Run();
      UnhookWindowsHookEx(_hookID);
    }

    private static IntPtr SetHook(LowLevelKeyboardProc proc)
    {
      using (Process curProcess = Process.GetCurrentProcess())
      using (ProcessModule curModule = curProcess.MainModule)
      {
        return SetWindowsHookEx(WH_KEYBOARD_LL, proc,
            GetModuleHandle(curModule.ModuleName), 0);
      }
    }

    private static Dictionary<string, string> ReadSettingsFromFile()
    {
      var path = Path.GetDirectoryName(Application.ExecutablePath);
      var pos = path.IndexOf("sector51");
      if (pos != -1) path = path.Substring(0, pos + 9) + "docker\\settings.properties";
      var data = new Dictionary<string, string>();
      foreach (var row in File.ReadAllLines(path))
        data.Add(row.Split('=')[0], string.Join("=", row.Split('=').Skip(1).ToArray()));
      return data;
    }
    
    private static void InsertCode(string code)
    {
      if (code == null || code.Trim().Length < 10) return;
      using (var conn = new NpgsqlConnection(string.Format(connectionString,
            props["POSTGRES_PASSWORD"], props["DB_NAME"], props["POSTGRES_PORT"], props["POSTGRES_HOST"])))
      {
        conn.Open();

        using (var cmd = new NpgsqlCommand())
        {
          cmd.Connection = conn;
          cmd.CommandText = "INSERT INTO history (eventId, key) VALUES (@eventId, @key)";
          cmd.Parameters.AddWithValue("eventId", 0);
          cmd.Parameters.AddWithValue("key", code);
          cmd.ExecuteNonQuery();
        }
      }
    }

    private delegate IntPtr LowLevelKeyboardProc(int nCode, IntPtr wParam, IntPtr lParam);

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
          InsertCode(message);
          message = "";
        }
        else if (nums.Contains(keyChar[0]))
        {
          message += keyChar;
        }
      }
      return CallNextHookEx(_hookID, nCode, wParam, lParam);
    }

    [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern IntPtr SetWindowsHookEx(int idHook, LowLevelKeyboardProc lpfn, IntPtr hMod, uint dwThreadId);

    [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool UnhookWindowsHookEx(IntPtr hhk);

    [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern IntPtr CallNextHookEx(IntPtr hhk, int nCode, IntPtr wParam, IntPtr lParam);

    [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern IntPtr GetModuleHandle(string lpModuleName);
  }
}
