using NLog;
using System;
using System.Collections;
using System.Configuration.Install;
using System.Reflection;
using System.Runtime.InteropServices;
using System.ServiceProcess;
using System.Threading;
using System.Linq;
using System.Threading.Tasks;

namespace ScannerService
{
  static class Program
  {
    private static Logger logger = LogManager.GetCurrentClassLogger();
    private static bool _mainThreadFinished = false;
    private static MyService _service;

    #region WinAPI
    private static HandlerRoutine _handlerRoutine;

    [DllImport("Kernel32")]
    public static extern bool SetConsoleCtrlHandler(HandlerRoutine Handler, bool Add);

    // A delegate type to be used as the handler routine
    // for SetConsoleCtrlHandler.
    public delegate bool HandlerRoutine(CtrlTypes CtrlType);

    // An enumerated type for the control messages
    // sent to the handler routine.
    public enum CtrlTypes
    {
      CTRL_C_EVENT = 0,
      CTRL_BREAK_EVENT,
      CTRL_CLOSE_EVENT,
      CTRL_LOGOFF_EVENT = 5,
      CTRL_SHUTDOWN_EVENT
    }
    #endregion
       

    static InstallContext GetInstallContext(string[] args)
    {
      InstallContext context = new InstallContext(null, args);
      UriBuilder uri = new UriBuilder(Assembly.GetEntryAssembly().GetName().CodeBase);
      string execPath = Uri.UnescapeDataString(uri.Path);
      context.Parameters.Add("assemblypath", execPath);
      return context;
    }

    private static bool ConsoleCtrlCheck(CtrlTypes ctrlType)
    {
      _service.StopInConsole();
      while (!_mainThreadFinished) Thread.Sleep(100);
      return true;
    }

    static void RunAsConsole()
    {
      _handlerRoutine = new HandlerRoutine(ConsoleCtrlCheck);
      SetConsoleCtrlHandler(_handlerRoutine, true);
      _service = new MyService();
      Task.WaitAll(_service.StartInConsole());
      _mainThreadFinished = true;
    }

    static void Main(string[] args)
    {
      if (!Environment.UserInteractive)
      {
        ServiceBase[] ServicesToRun = new ServiceBase[] { new MyService() };
        ServiceBase.Run(ServicesToRun);
        return;
      }

      var context = GetInstallContext(args);
      var myAssemblyVersion = Assembly.GetExecutingAssembly().GetName().Version;
      Console.WriteLine("Scanner Server, version {0}.{1}", myAssemblyVersion.Major, myAssemblyVersion.Minor);
      Console.WriteLine("Use /? or /h switches for help.", myAssemblyVersion.Major, myAssemblyVersion.Minor);
      Console.WriteLine();

      if (context.Parameters.Count == 1)
      {
        RunAsConsole();
        return;
      }

      var keys = new string[] { "?", "h", "i", "u", "s" };
      var parameters = context.Parameters.Keys.OfType<string>().Where(v => keys.Contains(v));
      if (parameters.Count() < 1)
      {
        logger.Error(string.Format("Unknown keys: {0}\n", 
          string.Join(",", context.Parameters.Keys.OfType<string>().Where(k => !k.Equals("assemblypath")))));
        return;
      }

      if (context.Parameters.ContainsKey("h") || context.Parameters.ContainsKey("?"))
      {
        Console.WriteLine("The following switches may be used in the command line:");
        Console.WriteLine("/?\t This help.");
        Console.WriteLine("/i\t");
        Console.WriteLine("/s\t Install UserScanner as service and start.");
        Console.WriteLine("/u\t Uninstall service.");
        return;
      }
      
      using (var installer = new MyServiceInstaller { Context = context })
      {
        IDictionary stateSaver = new Hashtable();
        try
        {
          ServiceController controller = new ServiceController(installer.ServiceName);
          if (context.Parameters.ContainsKey("i") || context.Parameters.ContainsKey("s"))
          {
            installer.Install(stateSaver);
            installer.Commit(stateSaver);
            Console.WriteLine("Service was succefully registered.");
            if (context.Parameters.ContainsKey("s"))
            {
              controller.Start();
              Console.WriteLine("Service was started.");
            }
          }
          else if (context.Parameters.ContainsKey("u"))
          {
            try
            {
              controller.Stop();
            }
            catch { }
            installer.Uninstall(null);
            Console.WriteLine("Service was succefully unregistered.");
          }
        }
        catch (Exception ex)
        {
          installer.Rollback(stateSaver);
          Console.WriteLine(ex.Message);
        }
      }
    }
  }
}
