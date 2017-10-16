package pr.sector51.server.web.rest;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import org.apache.ibatis.annotations.Insert;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import pr.sector51.server.persistence.model.*;
import pr.sector51.server.security.ERole;

import javax.management.relation.Role;

@RestController
public class RestUserController extends ARestController {
  private List<ERole> getPermissionsByContext() {
    SecurityContext context = SecurityContextHolder.getContext();
    UserSecurity userSecurity = (UserSecurity) context.getAuthentication().getPrincipal();
    return (List<ERole>) userSecurity.getAuthorities();
  }

  private ERole GetCurrentUserRole() {
    List<ERole> permissions = getPermissionsByContext();
    return permissions.stream().sorted(Comparator.comparingInt(a -> a.value)).findFirst().get();
  }

  @RequestMapping("/profile/{name}")
  @ResponseBody
  public UserInfo profile(@PathVariable("name") String name) {
    Timestamp created = userDao.getUserSecurityByName(name).getCreated();
    UserInfo user = userDao.getUserInfoById(created);
    return user;
  }

  @RequestMapping("/getUserById/{id}")
  @ResponseBody
  public UserInfo getUserById(@PathVariable("id") long id) {
    Timestamp created = new Timestamp(id);
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
  public Sector51Result createUser(@RequestBody UserInfo user) {
    ERole mRole = GetCurrentUserRole();
    ESector51Result result = mRole.value <= ERole.ADMIN.value ?  userDao.insertUser(user) : ESector51Result.NOT_DENIED;
    return new Sector51Result(result);
  }

  @RequestMapping(value = "/updateUser", method = RequestMethod.PUT)
  public Sector51Result updateUser(@RequestBody UserInfo user) {
    ERole mRole = GetCurrentUserRole();
    ESector51Result result =  mRole.value <= ERole.ADMIN.value ? userDao.updateUser(user) : ESector51Result.NOT_DENIED;
    return new Sector51Result(result);
  }

  @RequestMapping(value = "/removeUser/{created}", method = RequestMethod.DELETE)
  public Sector51Result removeUser(@PathVariable("created") long created) {
    Collection<? extends GrantedAuthority> permissions = getPermissionsByContext();
    ESector51Result result = permissions.contains(2) ? userDao.removeUser(created) : ESector51Result.NOT_DENIED;
    return new Sector51Result(result);
  }

  @RequestMapping(value = "/getUserByCard", method = RequestMethod.GET)
  public UserInfo getUserByCard(@RequestParam(value="card") String card) {
    return userDao.getUserInfoByCard(card);
  }

  @RequestMapping(value = "/getRoles", method = RequestMethod.GET)
  public List<KeyValuePair> getRoles() {
    return Arrays.asList(ERole.values()).stream()
            .map(r -> new KeyValuePair(r.value, r.name())).collect(Collectors.toList());
  }

  @RequestMapping(value = "/getUsers", method = RequestMethod.GET)
  public List<UserInfo> getUsers() {
    return userDao.getUsersInfo();
  }
}
