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

    public MyServiceInstaller()
    {
      serviceProcessInstaller = new ServiceProcessInstaller { Account = ServiceAccount.LocalSystem };
      serviceInstaller = new ServiceInstaller
      {
        ServiceName = Constants.SERVICE_NAME,
        DisplayName = Constants.SERVICE_NAME,
        Description = Constants.SERVICE_DESCRIPTION,
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
