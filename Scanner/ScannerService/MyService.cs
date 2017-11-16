using NLog;
using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.ServiceProcess;
using System.Threading;
using System.Threading.Tasks;

namespace ScannerService
{
  public partial class MyService : ServiceBase
  {
    private static Logger logger = LogManager.GetCurrentClassLogger();
    private string _loggedUser = String.Empty;
    
    private CancellationTokenSource _cts;
    private Task serviceTask;
    private readonly string connectionString;

    public MyService()
    {
      InitializeComponent();
      CanHandleSessionChangeEvent = true;
      var path = Assembly.GetExecutingAssembly().Location.Replace("ScannerService.exe", "settings.txt");
      var encrepted = File.ReadAllText(path);
      connectionString = Crypt.Decrypt256(encrepted);
    }
    
    protected override void OnStart(string[] args)
    {
      _cts = new CancellationTokenSource();
      serviceTask = Task.Factory.StartNew(() => Idle());
    }

    protected override void OnStop()
    {
      _cts.Cancel();
    }

    private void Idle()
    {
      logger.Info("Scanner service started");
      KillAllScanners();

      while (true)
      {
        try
        {
          if (_cts.IsCancellationRequested) break;

          var loggedInUserName = ProcessAsCurrentUser.GetLoggedInUserName();
          if (_loggedUser != loggedInUserName)
          {
            KillAllScanners();
            _loggedUser = loggedInUserName;
          }

          var userService = Process.GetProcessesByName(Constants.SCANNER_NAME);
          if (userService.Length < 1 && !string.IsNullOrEmpty(_loggedUser))
            LaunchScannerForLoggedUser();
          _cts.Token.WaitHandle.WaitOne(1000);
        }
        catch(Exception ex)
        {
          logger.Error(ex);
        }
      }
      KillAllScanners();
    }
    
    public Task StartInConsole()
    {
      OnStart(new string[] { });
      return serviceTask;
    }
    
    public void StopInConsole()
    {
      OnStop();
    }
       
    private void LaunchScannerForLoggedUser()
    {
      try
      {
        var codeBase = Assembly.GetExecutingAssembly().CodeBase;
        var uri = new UriBuilder(codeBase);
        var path = Uri.UnescapeDataString(uri.Path);
        path = Path.Combine(Path.GetDirectoryName(path), Constants.SCANNER_NAME + ".exe " + connectionString);
        ProcessAsCurrentUser.Launch(path);
      }
      catch (Exception ex)
      {
        logger.Error(ex, "Launch {0}", Constants.SCANNER_NAME);
      }
    }

    private void KillAllScanners()
    {
      logger.Info("KillAllScanners");
      var proces = Process.GetProcessesByName(Constants.SCANNER_NAME);
      if (proces.Length < 1) return;
      foreach (var service in proces)
      {
        try
        {
          logger.Info("PID:{0} User scanner is stopped", service.Id);
          service.Kill();
        }
        catch (Exception ex)
        {
          logger.Error(ex, "Kill failed {0}, id={1}", service.ProcessName, service.Id);
        }
      }
      var command = "docker stop db_container && docker stop web_container && docker start db_container && docker start web_container";
      logger.Info(command);
      Process.Start("CMD.exe", "/C " + command);
      logger.Info("Scanner service stopped");
    }
  }
}
