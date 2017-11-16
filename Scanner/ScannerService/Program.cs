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
using System.Diagnostics;
using System.IO;

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
      var context = new InstallContext(null, args);
      var uri = new UriBuilder(Assembly.GetEntryAssembly().GetName().CodeBase);
      var execPath = Uri.UnescapeDataString(uri.Path);
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

    static void saveConnectionString(string host, int port, string db, string user, string psw)
    {
      var template = "Host={0};Port={1};Database={2};Username={3};Password={4};";
      var connectionString = string.Format(template, host, port, db, user, psw);
      var encrypted = Crypt.Encrypt256(connectionString);
      var path = Assembly.GetExecutingAssembly().Location.Replace("ScannerService.exe", "settings.txt");
      File.WriteAllText(path, encrypted);
    }

    static void Main(string[] args)
    {
      if (!Environment.UserInteractive)
      {
       var ServicesToRun = new ServiceBase[] { new MyService() };
        ServiceBase.Run(ServicesToRun);
        return;
      }

      var context = GetInstallContext(args);
      var myAssemblyVersion = Assembly.GetExecutingAssembly().GetName().Version;
      Console.WriteLine("Scanner Server, version {0}.{1}", myAssemblyVersion.Major, myAssemblyVersion.Minor);
      Console.WriteLine("Use /? or /h switches for help.\n", myAssemblyVersion.Major, myAssemblyVersion.Minor);

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
        Console.WriteLine("/i host=hostName port=0 db=dbName user=userName psw=password\t " +
          "Install {0} as service.", Constants.SCANNER_NAME);
        Console.WriteLine("/s\t Install {0} as service and start.", Constants.SCANNER_NAME);
        Console.WriteLine("/u\t Uninstall service.");
        return;
      }
      
      using (var installer = new MyServiceInstaller { Context = context })
      {
        IDictionary stateSaver = new Hashtable();
        try
        {
          var controller = new ServiceController(Constants.SERVICE_NAME);
          if (context.Parameters.ContainsKey("i") || context.Parameters.ContainsKey("s"))
          {
            var host = context.Parameters["host"];
            host = string.IsNullOrEmpty(host) ? "localhost" : host;
            int port = 5432;
            int.TryParse(context.Parameters["port"], out port);
            var dbName = context.Parameters["db"];
            dbName = string.IsNullOrEmpty(dbName) ? "db" : dbName;
            var user = context.Parameters["user"];
            user = string.IsNullOrEmpty(user) ? "postgres" : user;
            var password = context.Parameters["psw"];
            password = string.IsNullOrEmpty(password) ? "123456" : password;
            saveConnectionString(host, port == 0 ? 5432 : port, dbName, user, password);
            installer.Install(stateSaver);
            installer.Commit(stateSaver);
            logger.Info("Service was succefully registered.");
            if (context.Parameters.ContainsKey("s"))
            {
              controller.Start();
            }
          }
          else if (context.Parameters.ContainsKey("u"))
          {
            if (controller.Status != ServiceControllerStatus.Stopped)
            {
              controller.Stop();
            }
            var proces = Process.GetProcessesByName(Constants.SCANNER_NAME);
            foreach (var p in proces)
            {
              p.Kill();
            }
            installer.Uninstall(null);
            logger.Info("Service was succefully unregistered.");
          }
        }
        catch (Exception ex)
        {
          if (stateSaver.Count > 0)
          {
            installer.Rollback(stateSaver);
          }
          logger.Error(ex.Message);
        }
      }
    }
  }
}
