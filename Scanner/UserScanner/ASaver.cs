using NLog;
using System;
using System.Collections;
using System.Threading;
using System.Threading.Tasks;

namespace UserScanner
{
  abstract class ASaver
  {
    protected static Logger logger = LogManager.GetCurrentClassLogger();
    private readonly Queue queuq;
    private bool isExecuting;
    private readonly int retries;

    public ASaver(int tries)
    {
      retries = tries;
      queuq = new Queue();
    }

    public void save(string value)
    {
      if (value == null || value.Length == 0)
      {
        return;
      }
      if (value.Length > 15)
      {
        value = value.Substring(value.Length - 15);
      }
      queuq.Enqueue(value);
      if (!isExecuting)
      {
        Task.Run(() => ExecuteWriteTask());
      }
    }

    private void ExecuteWriteTask()
    {
      isExecuting = true;
      while (queuq.Count > 0)
      {
        try
        {
          var start = DateTime.Now;
          var value = queuq.Dequeue().ToString();
          var success = false;
          for (var i = 0; i < retries; i++)
          {
            success = saveToDatabase(value);
            if (success)
            {
              break;
            }
            Thread.Sleep(100);
          }
          logger.Debug(string.Format("Value {0} was{1} write to database. [{2} ms]",
            value, success ? "" : "n't", (DateTime.Now - start).TotalMilliseconds));
        }
        catch(Exception ex)
        {
          logger.Error("ExecuteWriteTask error:\n" + ex);
        }
      }
      isExecuting = false;
    }

    protected abstract bool saveToDatabase(string value);
  }
}
