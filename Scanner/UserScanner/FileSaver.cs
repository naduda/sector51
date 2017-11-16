namespace UserScanner
{
  class FileSaver : ASaver
  {
    public FileSaver(int tries) : base(tries)
    {
    }

    protected override bool saveToDatabase(string value)
    {
      logger.Info("FileSaver: value = " + value);
      return true;
    }
  }
}
