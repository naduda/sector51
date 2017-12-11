package pr.sector51.server.web.rest;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pr.sector51.server.persistence.UserDao;
import pr.sector51.server.persistence.model.*;
import pr.sector51.server.security.ERole;
import pr.sector51.server.security.services.TokenHandler;

@RequestMapping("/api")
@RestController
public class RestUserController extends RestCommon {
  @Autowired
  private UserDao userDao;
  @Autowired
  private TokenHandler tokenHandler;

  // DELETE ===========================================================================
  @RequestMapping(value = "/delete/userById/{created}", method = RequestMethod.DELETE)
  public ESector51Result removeUser(@PathVariable("created") long created) {
    return userDao.removeUser(created);
  }

  // GET ==============================================================================
  @RequestMapping("/profileByName/{name}")
  @ResponseBody
  public UserInfo profile(@PathVariable("name") String login) {
    UserInfo userInfo = getUserInfoByLogin(login);
    return userDao.getUserInfoById(userInfo.getCreated());
  }

  @RequestMapping(value = "/roles", method = RequestMethod.GET)
  public List<KeyValuePair> getRoles() {
    return Arrays.asList(ERole.values()).stream()
        .map(r -> new KeyValuePair(r.value, r.name())).collect(Collectors.toList());
  }

  @RequestMapping(value = "/userByCard/{card}", method = RequestMethod.GET)
  public UserInfo getUserByCard(@PathVariable("card") String card) {
    return userDao.getUserInfoByCard(card);
  }

  @RequestMapping("/userById/{id}")
  @ResponseBody
  public UserInfo getUserById(@PathVariable("id") long id) {
    Timestamp created = new Timestamp(id);
    return userDao.getUserInfoById(created);
  }

  @RequestMapping(value = "/users", method = RequestMethod.GET)
  public List<UserInfo> getUsers() {
    return userDao.getUsersInfo();
  }

  // POST =============================================================================
  @RequestMapping(value = "/login", method = RequestMethod.POST)
  public String getToken(@RequestBody UserSecurity user) {
    String token = "";
    UserInfo userInfo = getUserInfoByLogin(user.getUsername());
    if (userInfo == null) {
      return String.format("{\"token\": \"%s\"}", token);
    }

    UserSecurity dbUser = userDao.getUserSecurityById(userInfo.getCreated());
    if (dbUser != null && userDao.encoder.matches(user.getPassword(), dbUser.getPassword())) {
      token = tokenHandler.generateToken(dbUser.getCreated().getTime(), LocalDateTime.now().plusDays(1));
    }
    return String.format("{\"token\": \"%s\"}", token);
  }

  @RequestMapping(value = "/add/user", method = RequestMethod.POST)
  public ESector51Result createUser(@RequestBody UserInfo user) {
    return userDao.insertUser(user);
  }

  // POST ============================================================================
  @RequestMapping(value = "/update/user", method = RequestMethod.PUT)
  public ESector51Result updateUser(@RequestBody UserInfo user) {
    return userDao.updateUser(user);
  }
}
