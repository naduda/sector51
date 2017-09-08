package pr.sector51.server.web.rest;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import pr.sector51.server.persistence.model.UserInfo;
import pr.sector51.server.persistence.model.UserSecurity;
import pr.sector51.server.security.ERole;

import javax.management.relation.Role;

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

  @RequestMapping(value = "/createUser", method = RequestMethod.POST)
  public String createUser(@RequestBody UserInfo user) {
    SecurityContext context = SecurityContextHolder.getContext();
    UserSecurity userSecurity = (UserSecurity) context.getAuthentication().getPrincipal();
    List<Integer> permitions = userDao.getUserPermitions(userSecurity.getCreated());
    int result = permitions.contains(2) ? userDao.insertUser(user) : 2;
    return String.format("{\"result\": \"%s\"}", result);
  }

  @RequestMapping(value = "/getUserByCard", method = RequestMethod.GET)
  public UserInfo getUserByCard(@RequestParam(value="card") String card) {
    return userDao.getUserInfoByCard(card);
  }

  @RequestMapping(value = "/getRoles", method = RequestMethod.GET)
  public List<ERole> getRoles() {
    return Arrays.asList(ERole.values());
  }

  @RequestMapping(value = "/getUserPermition", method = RequestMethod.GET)
  public List<Integer> getUserPermition(@RequestParam(value="idUser") long idUser) {
    return userDao.getUserPermitions(new Timestamp(idUser));
  }
}
