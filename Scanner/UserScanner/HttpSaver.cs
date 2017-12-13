using System;
using System.IO;
using System.Net;
using System.Text;

namespace UserScanner
{
  class HttpSaver : ASaver
  {
    private readonly string REQUEST_URL;

    public HttpSaver(int tries, string port) : base(tries)
    {
      REQUEST_URL = string.Format("http://localhost:{0}/api/scanner", port);
    }

    protected override bool saveValue(string value)
    {
      try
      {
        var result = HttpPost(REQUEST_URL, "code=" + value);
        logger.Info(string.Format("HttpSaver: value = {0} was{1} sended", value, "\"OK\"".Equals(result) ? "" : "'t"));
      }
      catch(Exception ex)
      {
        logger.Error(ex);
      }
      return true;
    }

    private string HttpPost(string URI, string Parameters)
    {
      var req = WebRequest.Create(URI);
      req.ContentType = "application/x-www-form-urlencoded";
      req.Method = "POST";
      var bytes = Encoding.ASCII.GetBytes(Parameters);
      req.ContentLength = bytes.Length;

      using (var os = req.GetRequestStream()) os.Write(bytes, 0, bytes.Length);

      var resp = req.GetResponse();
      if (resp == null) return null;
      using (var sr = new StreamReader(resp.GetResponseStream()))
        return sr.ReadToEnd().Trim();
    }
  }
}
