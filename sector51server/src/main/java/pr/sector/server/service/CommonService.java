package pr.sector.server.service;

import org.springframework.stereotype.Service;
import pr.sector.server.dto.SelectItemDTO;
import pr.sector.server.model.ERoleName;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

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

  public List<SelectItemDTO<String>> getRoles() {
    var result = new ArrayList<SelectItemDTO<String>>();

    for (var role : ERoleName.values()) {
      var item = new SelectItemDTO<>(role.name(), role.label);
      item.setDisabled(!role.showPasswordField);
      result.add(item);
    }

    return result;
  }
}
