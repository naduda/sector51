using NLog;
using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.ServiceProcess;
using System.Threading;
using System.Threading.Tasks;

namespace ScannerService
{
  public partial class MyService : ServiceBase
  {
    private const string ScannerName = "UserScanner";
    private static Logger logger = LogManager.GetCurrentClassLogger();
    private string _loggedUser = String.Empty;
    
    private CancellationTokenSource _cts;
    private Task serviceTask;
    
    public MyService()
    {
      InitializeComponent();
      CanHandleSessionChangeEvent = true;
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

      for (;;)
      {
        string loggedInUserName = ProcessAsCurrentUser.GetLoggedInUserName();
        if(_loggedUser != loggedInUserName)
        {
          KillAllScanners();
          _loggedUser = loggedInUserName;
        }
        
        var runUserService = Process.GetProcesses()
                 .Where(p => p.ProcessName.StartsWith(ScannerName))
                 .FirstOrDefault();

        if (runUserService == null && !String.IsNullOrEmpty(_loggedUser))
          LaunchScannerForLoggedUser();
        
        if (_cts.IsCancellationRequested)
          break;

        _cts.Token.WaitHandle.WaitOne(1000);
      }

      KillAllScanners();
      logger.Info("Scanner service stopped");
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
    
    private string GetScannerAppPath()
    {
      string codeBase = Assembly.GetExecutingAssembly().CodeBase;
      UriBuilder uri = new UriBuilder(codeBase);
      string path = Uri.UnescapeDataString(uri.Path);
      return Path.Combine(Path.GetDirectoryName(path), ScannerName + ".exe");
    }
        
    private void LaunchScannerForLoggedUser()
    {
      try
      {
        ProcessAsCurrentUser.Launch(GetScannerAppPath());
      }
      catch (Exception ex)
      {
        logger.Error(ex, "Launch {0}", ScannerName);
      }
    }

    private void KillAllScanners()
    {
      try
      {
        foreach (var service in Process.GetProcesses().Where(p => p.ProcessName.StartsWith(ScannerName)))
        {
          try
          {
            service.Kill();
            logger.Info("Kill {0}, id={1}", service.ProcessName, service.Id);
          }
          catch (Exception ex)
          {
            logger.Error(ex, "Kill failed {0}, id={1}", service.ProcessName, service.Id);
          }
        }
      }
      catch(Exception ex)
      {

      }
    }
  }
}
