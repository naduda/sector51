package pr.sector51.server.web.rest;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import org.springframework.web.bind.annotation.*;
import pr.sector51.server.persistence.model.UserInfo;
import pr.sector51.server.persistence.model.UserSecurity;

@RestController
public class RestUserController extends ARestController {
  @RequestMapping("/profile/{name}")
  @ResponseBody
  public UserInfo profile(@PathVariable("name") String name) {
    Timestamp created = userDao.getUserSecurityByName(name).getCreated();
    UserInfo user = userDao.getUserInfoById(created);
    return user;
  }

  @RequestMapping(value = "/login", method = RequestMethod.POST)
  public String getToken(@RequestBody UserSecurity user) {
    UserSecurity dbUser = userDao.getUserSecurityByName(user.getUsername());
    String token = "";
    if (dbUser != null && userDao.encoder.matches(user.getPassword(), dbUser.getPassword())) {
      token = tokenHandler
          .generateToken(dbUser.getCreated().getTime(), LocalDateTime.now().plusDays(1));
    }
    return String.format("{\"token\": \"%s\"}", token);
  }

  @RequestMapping(value = "/getUserByCard", method = RequestMethod.GET)
  public UserInfo getUserByCard(@RequestParam(value="card") String card) {
    return userDao.getUserInfoByCard(card);
  }
}
