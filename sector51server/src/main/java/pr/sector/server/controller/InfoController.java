package pr.sector.server.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pr.sector.server.dto.InfoDTO;

@RestController
@RequestMapping("public")
public class InfoController {

  @GetMapping("info")
  public ResponseEntity<InfoDTO> info() {
    InfoDTO result = new InfoDTO();
    return ResponseEntity.ok(result);
  }
}
