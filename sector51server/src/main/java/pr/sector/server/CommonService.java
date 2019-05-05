package pr.sector.server;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

@Service
public class CommonService {

  public String getResource(String resource) {
    try (var is = getClass().getClassLoader().getResourceAsStream(resource);
         var buf = new BufferedReader(new InputStreamReader(is))) {

      var line = buf.readLine();
      var sb = new StringBuilder();

      while (line != null) {
        sb.append(line).append("\n");
        line = buf.readLine();
      }

      return sb.toString();
    } catch (IOException e) {
      e.printStackTrace();
    }

    return null;
  }
}
