package pr.sector51.server.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import pr.sector51.server.persistence.ThingsDao;
import pr.sector51.server.persistence.UserDao;
import pr.sector51.server.persistence.model.*;

import java.sql.Timestamp;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RequestMapping("api")
@RestController
public class RestThingsController extends RestCommon {
  private ThingsDao thingsDao;
  private UserDao userDao;

  @Autowired
  public RestThingsController(ThingsDao thingsDao, UserDao userDao) {
    this.thingsDao = thingsDao;
    this.userDao = userDao;
  }

  // DELETE
  // ==========================================================================
  @DeleteMapping("delete/boxType/{id}")
  public ResponseEntity<String> removeBoxTypeById(@PathVariable("id") int id) {
    return ResponseEntity.ok("BoxType was" + (thingsDao.removeBoxType(id) ? "" : "n't") + " deleted.");
  }

  @DeleteMapping("delete/boxNumber/{params}")
  public ResponseEntity<String> removeBoxNumber(@PathVariable("params") String params) {
    String[] pars = params.split("_");
    BoxNumber boxNumber = new BoxNumber(Integer.parseInt(pars[0]), Integer.parseInt(pars[1]));
    return ResponseEntity.ok("Box was" + (thingsDao.removeBoxNumber(boxNumber) ? "" : "n't") + " deleted.");
  }

  @DeleteMapping("delete/userservice/{params}")
  public ResponseEntity<String> removeUserService(@PathVariable("params") String params) {
    String[] pars = params.split("_");
    int count = thingsDao.removeUserService(Long.parseLong(pars[0]), Integer.parseInt(pars[1]));
    return ResponseEntity.ok("User's service was" + (count > 0 ? "" : "n't") + " deleted.");
  }

  // GET
  // ==============================================================================
  @GetMapping("boxtypes")
  public List<BoxType> boxtypes() {
    return thingsDao.getBoxTypes();
  }

  @GetMapping("events")
  public List<Event> events() {
    return thingsDao.getEvents();
  }

  @GetMapping("history/{period}")
  public List<History> history(@PathVariable("period") String period) {
    String[] times = period.split("_");
    Timestamp dtBeg = new Timestamp(Long.parseLong(times[0]));
    Timestamp dtEnd = new Timestamp(Long.parseLong(times[1]));
    return thingsDao.getHistory(dtBeg, dtEnd);
  }

  @GetMapping("boxnumbers")
  public List<BoxNumber> boxnumbers() {
    return thingsDao.getBoxNumbers();
  }

  @GetMapping("services")
  public List<Service51> services() {
    return thingsDao.getServices();
  }

  @GetMapping("userservices/{idUser}")
  public ResponseEntity<List<UserService51>> userServices(@PathVariable("idUser") String idUser) {
    Timestamp userId = new Timestamp(Long.parseLong(idUser));
    return ResponseEntity.ok(thingsDao.getUserServices(userId));
  }

  @GetMapping("userservices")
  public ResponseEntity<List<UserService51>> userServices() {
    return ResponseEntity.ok(thingsDao.getUserServices());
  }

  // POST
  // ============================================================================
  @PostMapping("add/userWithServices")
  public ResponseEntity<List<Integer>> insertUserWithServices(@RequestBody List<Map<String, String>> rows) {
    userDao.removeAllUsers();
    long start = System.currentTimeMillis();
    List<Integer> status = new ArrayList<>(rows.size());
    for (int i = 0; i < rows.size(); i++) {
      status.add(1);
      try {
        Map<String, String> row = rows.get(i);
        String password = row.getOrDefault("password", row.get("card"));
        String roles = row.getOrDefault("user_type", "USER");
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
        String created = formatter.format(LocalDateTime.now());
        String name = row.get("name");
        String surname = row.get("surname");
        String phone = row.getOrDefault("phone", "");
        String email = row.getOrDefault("email", "");
        String card = row.get("card");
        boolean sex = row.get("sex").toUpperCase().equals("M") || row.get("sex").toUpperCase().equals("М");
        String birthday = row.getOrDefault("birthday", "01.01.1870");
        LocalDate bd = LocalDate.parse(birthday, DateTimeFormatter.ofPattern("dd.MM.yyyy"));
        birthday = formatter.format(bd.atStartOfDay());

        String dtbeg_a = formatter
                .format(getTimestampFromString(row.getOrDefault("dtbeg_a", "01.01.1970")).toLocalDateTime());
        String dtend_a = formatter
                .format(getTimestampFromString(row.getOrDefault("dtend_a", "01.01.1970")).toLocalDateTime());
        String abontype = row.getOrDefault("abontype", "M");
        int abonServiceId = abontype.equals("M") || abontype.equals("М") ? 3
                : abontype.equals("E") || abontype.equals("Е") ? 4 : 0;
        String boxNumber = row.getOrDefault("box", "0");

        String dtbeg_b = formatter
                .format(getTimestampFromString(row.getOrDefault("dtbeg_b", "01.01.1970")).toLocalDateTime());
        String dtend_b = formatter
                .format(getTimestampFromString(row.getOrDefault("dtend_b", "01.01.1970")).toLocalDateTime());


        String query = "INSERT INTO usersecurity(password, roles, created) VALUES ('#{password}', '#{roles}', '#{created}');\n"
                + "INSERT INTO userinfo(created, name, surname, phone, email, card, sex, birthday)"
                + "VALUES ('#{created}', '#{name}', '#{sname}', '#{phone}', '#{email}', '#{card}', #{sex}, '#{bd}');\n"
                + "INSERT INTO user_service VALUES(#{abonServiceId}, '#{created}', '#{dtBeg_a}', '#{dtEnd_a}', '');\n"
                + "INSERT INTO user_service VALUES(2, '#{created}', '#{dtBeg_b}', '#{dtEnd_b}', '#{boxNumber}');";
        query = query.replace("#{password}", password);
        query = query.replace("#{roles}", roles);
        query = query.replace("#{created}", created);
        query = query.replace("#{name}", name);
        query = query.replace("#{sname}", surname);
        query = query.replace("#{phone}", phone);
        query = query.replace("#{email}", email);
        query = query.replace("#{card}", card);
        query = query.replace("#{sex}", Boolean.toString(sex));
        query = query.replace("#{bd}", birthday);
        query = query.replace("#{abonServiceId}", String.valueOf(abonServiceId));
        query = query.replace("#{dtBeg_a}", dtbeg_a);
        query = query.replace("#{dtEnd_a}", dtend_a);
        query = query.replace("#{dtBeg_b}", dtbeg_b);
        query = query.replace("#{dtEnd_b}", dtend_b);
        query = query.replace("#{boxNumber}", boxNumber);
        userDao.update(query);
      } catch (Exception ex) {
        status.set(i, 0);
      }
    }
    String started = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
            .format(LocalDateTime.ofInstant(Instant.ofEpochMilli(start), ZoneId.systemDefault()));
    userDao.update("DELETE FROM user_service WHERE dtbeg < '2000-01-01';"
            + "UPDATE userinfo set birthday = null WHERE birthday < '1900-01-01';" + "DELETE FROM history WHERE time > '"
            + started + "';");
    return ResponseEntity.ok(status);
  }

  private Timestamp getTimestampFromString(String value) {
    return new Timestamp(LocalDate.parse(value, DateTimeFormatter.ofPattern("dd.MM.yyyy")).atStartOfDay()
            .toInstant(ZoneOffset.UTC).toEpochMilli());
  }

  @PostMapping("add/userservice")
  public ResponseEntity<UserService51> userService(@RequestBody UserService51 userService) {
    UserService51[] inserted = new UserService51[1];
    thingsDao.runTransaction(() -> {
      inserted[0] = thingsDao.insertUserService(userService);
      if (userService.getIdService() == 2) {
        BoxNumber box = new BoxNumber(3, Integer.parseInt(userService.getValue()));
        UserInfo userInfo = userDao.getUserInfoById(userService.getIdUser());
        box.setCard(userInfo.getCard());
        thingsDao.updateBox(box);
      }
    });
    return ResponseEntity.ok(inserted[0]);
  }

  @PostMapping("add/boxNumber")
  public ResponseEntity<BoxNumber> insertBoxNumber(@RequestBody BoxNumber boxNumber) {
    int id = thingsDao.insertBoxNumber(boxNumber);
    boxNumber.setNumber(id);
    return ResponseEntity.ok(boxNumber);
  }

  // PUT
  // =============================================================================
  @PutMapping("update/boxType")
  public ResponseEntity<String> updateBoxtype(@RequestBody BoxType boxType) {
    return ResponseEntity.ok("BoxType was" + (thingsDao.updateBoxType(boxType) ? "" : "n't") + " updated.");
  }

  @PutMapping("update/boxNumber")
  public ResponseEntity<String> updateBox(@RequestBody BoxNumber boxNumber) {
    if (boxNumber.getIdtype() == 3)
      throw new IllegalArgumentException();
    return ResponseEntity.ok("Box was" + (thingsDao.updateBox(boxNumber) ? "" : "n't") + " updated.");
  }

  @PutMapping("update/userservice")
  public ResponseEntity<String> updateBox(@RequestBody UserService51 userService) {
    boolean success = thingsDao.updateUserService(userService) == 1;
    return ResponseEntity.ok("User's service was" + (success ? "" : "n't") + " updated.");
  }

  @PutMapping("update/service")
  public ResponseEntity<String> updateService(@RequestBody Service51 servise) {
    return ResponseEntity.ok("User's service was" + (thingsDao.updateService(servise) ? "" : "n't") + " updated.");
  }

  @PutMapping("update/events/{field}")
  public ResponseEntity<String> updateEvents(@PathVariable("field") String field,
                                             @RequestBody Map<String, List<Integer>> eventIds) {
    if (field == null)
      throw new IllegalArgumentException();
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    UserSecurity currentUserSecurity = (UserSecurity) auth.getDetails();
    long userId = currentUserSecurity.getCreated().getTime();
    List<Integer> ids = eventIds.get("ids");

    boolean success = thingsDao.runTransaction(() -> {
      List<Event> events = events();
      events.forEach(e -> {
        boolean isAdd = ids.contains(e.getId());
        switch (field.toLowerCase()) {
          case "email":
            String email = e.getEmail() == null ? "" : e.getEmail();
            email = email.replace(String.valueOf(userId), "").replace(",,", ",");
            if (isAdd) {
              email += "," + userId;
            }
            if (email.startsWith(","))
              email = email.substring(1);
            if (email.endsWith(","))
              email = email.substring(0, email.length() - 1);
            e.setEmail(email);
            break;
        }
        if (thingsDao.updateEvent(e) == 0)
          throw new RuntimeException();
      });
    });

    return ResponseEntity.ok("Events were" + (success ? "" : "n't") + " updated.");
  }
}