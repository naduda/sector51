package pr.sector.server.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pr.sector.server.CommonService;
import pr.sector.server.dto.InfoDTO;

@RestController
@RequestMapping("public")
public class InfoController {
  private CommonService commonService;

  public InfoController(CommonService pCommonService) {
    commonService = pCommonService;
  }

  @GetMapping("info")
  public ResponseEntity<InfoDTO> info() {
    var result = new InfoDTO();
    return ResponseEntity.ok(result);
  }

  @GetMapping("test")
  @Secured("ROLE_ADMIN")
  public ResponseEntity<String> test() {
    return ResponseEntity.ok("admin test");
  }

  @GetMapping("translation/{code}")
  public ResponseEntity<String> getTranslationByCountryCode(@PathVariable("code") String countryCode) {
    var resource = "languages/" + countryCode + ".json";
    return ResponseEntity.ok(commonService.getResource(resource));
  }
}
