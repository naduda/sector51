using NLog;
using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.ServiceProcess;
using System.Threading;

namespace ScannerService
{
  public partial class MyService : ServiceBase
  {
    private const string ScannerName = "UserScanner";
    private static Logger logger = LogManager.GetCurrentClassLogger();

    public MyService()
    {
      InitializeComponent();
      CanHandleSessionChangeEvent = true;
    }
    
    protected override void OnStart(string[] args)
    {
      OnConsoleStart();
    }

    protected override void OnStop()
    {
      OnConsoleStop();
    }

    protected override void OnSessionChange(SessionChangeDescription changeDescription)
    {
      logger.Info("Session changed");

      if (changeDescription.Reason == SessionChangeReason.SessionLogon)
      {
        base.OnSessionChange(changeDescription);
        KillAllScanners();
        Thread.Sleep(1000);
        var user = Session.Get(changeDescription.SessionId);
        if (user != null)
        {
          Debugger.Launch();
          logger.Info("User {0} logged in.", user.Name);
          LaunchScannerForLoggedUser();
        }
      }

      base.OnSessionChange(changeDescription);
    }
    
    public void OnConsoleStart()
    {
      logger.Info("Scanner service started");
      KillAllScanners();
      LaunchScannerForLoggedUser();
    }

    public void OnConsoleStop()
    {
      KillAllScanners();
      logger.Info("Scanner service stopped");
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
      foreach (var service in Process.GetProcesses().Where(p => p.ProcessName.StartsWith(ScannerName)))
      {
        try
        {
          service.Kill();
          logger.Info("Kill {0}, id={1}", service.ProcessName, service.Id);
        }
        catch(Exception ex)
        {
          logger.Error(ex, "Kill failed {0}, id={1}", service.ProcessName, service.Id);
        }
      }
    }
  }
}
