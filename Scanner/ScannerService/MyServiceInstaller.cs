using System.Collections;
using System.ComponentModel;
using System.Configuration.Install;
using System.ServiceProcess;

namespace ScannerService
{
  [RunInstaller(true)]
  public class MyServiceInstaller : Installer
  {
    private ServiceProcessInstaller serviceProcessInstaller;
    private ServiceInstaller serviceInstaller;
    public string ServiceName => "ScannerService";
    public string ServiceDescription => "Manages keyboard hookers";

    public MyServiceInstaller()
    {
      serviceProcessInstaller = new ServiceProcessInstaller { Account = ServiceAccount.LocalSystem };
      serviceInstaller = new ServiceInstaller
      {
        ServiceName = ServiceName,
        DisplayName = ServiceName,
        Description = ServiceDescription,
        StartType = ServiceStartMode.Automatic
      };
      Installers.AddRange(new Installer[] { serviceProcessInstaller, serviceInstaller });
    }

    public override void Install(IDictionary stateSaver)
    {
      base.Install(stateSaver);
    }

    public override void Uninstall(IDictionary savedState)
    {
      base.Uninstall(savedState);
    }
  }
}
