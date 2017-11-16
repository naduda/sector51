using System;
using System.Security.Cryptography;
using System.Text;

namespace ScannerService
{
  public class Crypt
  {
    private static readonly AesCryptoServiceProvider AesProvider = new AesCryptoServiceProvider
    {
      BlockSize = 128,
      KeySize = 256,
      IV = Encoding.UTF8.GetBytes(Constants.AesIV256),
      Key = Encoding.UTF8.GetBytes(Constants.AesKey256),
      Mode = CipherMode.CBC,
      Padding = PaddingMode.PKCS7
    };

    public static string Encrypt256(string text)
    {
      byte[] src = Encoding.Unicode.GetBytes(text);
      using (ICryptoTransform encrypt = AesProvider.CreateEncryptor())
      {
        byte[] dest = encrypt.TransformFinalBlock(src, 0, src.Length);
        return Convert.ToBase64String(dest);
      }
    }

    public static string Decrypt256(string text)
    {
      byte[] src = Convert.FromBase64String(text);
      using (ICryptoTransform decrypt = AesProvider.CreateDecryptor())
      {
        byte[] dest = decrypt.TransformFinalBlock(src, 0, src.Length);
        return Encoding.Unicode.GetString(dest);
      }
    }
  }
}
