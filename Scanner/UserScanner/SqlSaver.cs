using Npgsql;
using System;
using System.Data;
using System.Diagnostics;
using System.Net.Sockets;

namespace UserScanner
{
  class SqlSaver : ASaver
  {
    private const string UPDATE_QUERY = "UPDATE scanner SET code = @code, time = now();";
    private readonly NpgsqlConnectionStringBuilder connectionStringBuilder;
    private readonly string connectionString;

    public SqlSaver(int tries, string connectionString) : base(tries)
    {
      logger.Debug(connectionString);
      connectionStringBuilder = new NpgsqlConnectionStringBuilder(connectionString)
      {
        Timeout = 3,
        CommandTimeout = 3
      };
      this.connectionString = connectionStringBuilder.ConnectionString;
    }

    protected override bool saveToDatabase(string value)
    {
      using (var connection = new NpgsqlConnection(connectionString))
      {
        try
        {
          connection.Open();
        }
        catch (Exception ex)
        {
          logger.Error("Cann't open connection.\n\t[Exception: " + ex + "]");
          if (ex is SocketException)
          {
            TryStartDBserver();
          }
        }
        return connection.State == ConnectionState.Open && writeToDatabase(connection, value);
      }
    }
    
    private void TryStartDBserver()
    {
      logger.Info("docker start db_container");
      Process.Start("CMD.exe", "/C docker start db_container");
    }

    private bool writeToDatabase(NpgsqlConnection connection, string value)
    {
      using (var cmd = new NpgsqlCommand(UPDATE_QUERY, connection))
      {
        try
        {
          cmd.Parameters.AddWithValue("code", value);
          return cmd.ExecuteNonQuery() == 1;
        }
        catch (Exception ex)
        {
          logger.Error("Command was failed. [Exception: " + ex.Message + "]");
        }
      }
      return false;
    }
  }
}
