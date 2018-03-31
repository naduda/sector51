using System;

namespace ScannerService
{
  class User
  {
    public readonly string Name;
    public readonly string Domain;
    private bool _signedIn;
    public static EventHandler<AvailabilityChangedEventArgs> AvailabilityChanged = delegate { };

    public User(string name, string domain)
    {
      Name = name;
      Domain = domain;
    }
    
    public bool IsSignedIn
    {
      get { return _signedIn; }
      set
      {
        if (_signedIn == value) return;
        _signedIn = value;
        AvailabilityChanged(this, new AvailabilityChangedEventArgs(IsSignedIn));
      }
    }
  }
}
