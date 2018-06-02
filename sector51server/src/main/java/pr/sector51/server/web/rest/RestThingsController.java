package pr.sector51.server.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import pr.sector51.server.persistence.ThingsDao;
import pr.sector51.server.persistence.UserDao;
import pr.sector51.server.persistence.model.*;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RequestMapping("/api")
@RestController
public class RestThingsController extends RestCommon {
  @Autowired
  private ThingsDao thingsDao;
  @Autowired
  private UserDao userDao;

  // DELETE ==========================================================================
  @RequestMapping(value = "/delete/boxType/{id}", method = RequestMethod.DELETE)
  public Sector51Result removeBoxTypeById(@PathVariable("id") int id) {
    return thingsDao.removeBoxType(id);
  }

  @RequestMapping(value = "/delete/boxNumber/{params}", method = RequestMethod.DELETE)
  public Sector51Result removeBoxNumber(@PathVariable("params") String params) {
    String[] pars = params.split("_");
    BoxNumber boxNumber = new BoxNumber(Integer.parseInt(pars[0]), Integer.parseInt(pars[1]));
    return thingsDao.removeBoxNumber(boxNumber);
  }

  @RequestMapping(value = "/delete/userservice/{params}", method = RequestMethod.DELETE)
  public Sector51Result removeUserService(@PathVariable("params") String params) {
    Sector51Result result = new Sector51Result(ESector51Result.ERROR);
    try {
      String[] pars = params.split("_");
      int count = thingsDao.removeUserService(Long.parseLong(pars[0]), Integer.parseInt(pars[1]));
      result.setResult(count > 0 ? ESector51Result.OK : ESector51Result.ERROR);
    } catch (Exception ex) {
      result.setMessage(ex.getMessage());
    }
    return result;
  }

  // GET ==============================================================================
  @RequestMapping("/boxtypes")
  public List<BoxType> boxtypes() {
    return thingsDao.getBoxTypes();
  }

  @RequestMapping("/events")
  public List<Event> events() {
    List<Event> events = thingsDao.getEvents();
    return events;
  }

  @RequestMapping("/history/{period}")
  public List<History> history(@PathVariable("period") String period) {
    String[] times = period.split("_");
    Timestamp dtBeg = new Timestamp(Long.parseLong(times[0]));
    Timestamp dtEnd = new Timestamp(Long.parseLong(times[1]));
    return thingsDao.getHistory(dtBeg, dtEnd);
  }

  @RequestMapping("/boxnumbers")
  public List<BoxNumber> boxnumbers() {
    return thingsDao.getBoxNumbers();
  }

  @RequestMapping("/services")
  public List<Service51> services() {
    return thingsDao.getServices();
  }

  @RequestMapping("/userservices/{idUser}")
  public Sector51Result userServices(@PathVariable("idUser") String idUser) {
    Sector51Result result = new Sector51Result(ESector51Result.OK);
    try {
      Timestamp userId = new Timestamp(Long.parseLong(idUser));
      result.setMessage(thingsDao.getUserServices(userId));
    } catch (Exception ex) {
      result.setResult(ESector51Result.ERROR);
      result.setMessage(ex.getMessage());
    }
    return result;
  }

  // POST ============================================================================
  @RequestMapping(value = "/add/userWithServices", method = RequestMethod.POST)
  public Sector51Result insertUserWithServices(@RequestBody List<Map<String, String>> rows) {
    List<Integer> status = new ArrayList<>(rows.size());
    for (int i = 0; i < rows.size(); i++) {
      status.add(1);
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

      String dtbeg_a = formatter.format(getTimestampFromString(row.getOrDefault("dtbeg_a", "01.01.1970")).toLocalDateTime());
      String dtend_a = formatter.format(getTimestampFromString(row.getOrDefault("dtend_a", "01.01.1970")).toLocalDateTime());
      String abontype = row.getOrDefault("abontype", "M");
      int abonServiceId = abontype == "M" || abontype == "М" ? 3 : abontype == "E" || abontype == "Е" ? 4 : 0;
      String boxNumber = row.getOrDefault("box", "0");

      String dtbeg_b = formatter.format(getTimestampFromString(row.getOrDefault("dtbeg_b", "01.01.1970")).toLocalDateTime());
      String dtend_b = formatter.format(getTimestampFromString(row.getOrDefault("dtend_b", "01.01.1970")).toLocalDateTime());

      try {
        String query =
                "INSERT INTO usersecurity(password, roles, created) VALUES ('#{password}', '#{roles}', '#{created}');\n" +
                        "INSERT INTO userinfo(created, name, surname, phone, email, card, sex, birthday)" +
                        "VALUES ('#{created}', '#{name}', '#{sname}', '#{phone}', '#{email}', '#{card}', #{sex}, '#{bd}');\n" +
                        "INSERT INTO barcode VALUES(100, '#{card}');\n" +
                        "INSERT INTO user_service VALUES(#{abonServiceId}, '#{created}', '#{dtBeg_a}', '#{dtEnd_a}', '');\n" +
                        "INSERT INTO user_service VALUES(2, '#{created}', '#{dtBeg_b}', '#{dtEnd_b}', '#{boxNumber}');";
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
    try {
      userDao.update("DELETE FROM user_service WHERE dtbeg < '2000-01-01';" +
              "UPDATE userinfo set birthday = null WHERE birthday < '1900-01-01';");
    } catch (Exception ex) {
      ex.printStackTrace();
    }
    Sector51Result result = new Sector51Result(ESector51Result.OK);
    result.setMessage(status);
    return result;
  }

  private Timestamp getTimestampFromString(String value) {
    return new Timestamp(LocalDate.parse(value, DateTimeFormatter.ofPattern("dd.MM.yyyy"))
            .atStartOfDay().toInstant(ZoneOffset.UTC).toEpochMilli());
  }

  @RequestMapping(value = "/add/userservice", method = RequestMethod.POST)
  public Sector51Result userService(@RequestBody UserServise51 userService) {
    Sector51Result result = new Sector51Result(ESector51Result.OK);
    try {
      boolean trResult = thingsDao.runTransaction(() -> {
        UserServise51 inserted = thingsDao.insertUserService(userService);
        if (userService.getIdService() == 2) {
          BoxNumber box = new BoxNumber(3, Integer.parseInt(userService.getValue()));
          UserInfo userInfo = userDao.getUserInfoById(userService.getIdUser());
          box.setCard(userInfo.getCard());
          thingsDao.updateBox(box);
        }
        result.setMessage(inserted);
      });
      result.setResult(trResult ? ESector51Result.OK : ESector51Result.ERROR);
    } catch (Exception ex) {
      result.setMessage(ex.getMessage());
      result.setResult(ESector51Result.ERROR);
    }
    return result;
  }

  @RequestMapping(value = "/add/boxNumber", method = RequestMethod.POST)
  public Sector51Result insertBoxNumber(@RequestBody BoxNumber boxNumber) {
    Sector51Result result = new Sector51Result(ESector51Result.OK);
    int id = thingsDao.insertBoxNumber(boxNumber);
    result.setMessage(id);
    return result;
  }

  // PUT =============================================================================
  @RequestMapping(value = "/update/boxType", method = RequestMethod.PUT)
  public Sector51Result updateBoxtype(@RequestBody BoxType boxType) {
    return thingsDao.updateBoxType(boxType);
  }

  @RequestMapping(value = "/update/boxNumber", method = RequestMethod.PUT)
  public Sector51Result updateBox(@RequestBody BoxNumber boxNumber) {
    if (boxNumber.getIdtype() == 3) return new Sector51Result(ESector51Result.ERROR);
    return thingsDao.updateBox(boxNumber);
  }

  @RequestMapping(value = "/update/userservice", method = RequestMethod.PUT)
  public Sector51Result updateBox(@RequestBody UserServise51 userService) {
    int result = thingsDao.updateUserService(userService);
    return new Sector51Result(result > 0 ? ESector51Result.OK : ESector51Result.ERROR);
  }

  @RequestMapping(value = "/update/service", method = RequestMethod.PUT)
  public Sector51Result updateService(@RequestBody Service51 servise) {
    return thingsDao.updateService(servise);
  }

  @RequestMapping(value = "/update/events/{field}", method = RequestMethod.PUT)
  public Sector51Result updateEvents(@PathVariable("field") String field, @RequestBody Map<String, List<Integer>> eventIds) {
    if (field == null) return new Sector51Result(ESector51Result.ERROR);
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    UserSecurity currentUserSecurity = (UserSecurity) auth.getDetails();
    long userId = currentUserSecurity.getCreated().getTime();
    List<Integer> ids = eventIds.get("ids");

    Sector51Result httpResult = new Sector51Result(ESector51Result.OK);

    boolean result = thingsDao.runTransaction(() -> {
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
            if (email.startsWith(",")) email = email.substring(1);
            if (email.endsWith(",")) email = email.substring(0, email.length() - 1);
            e.setEmail(email);
            break;
        }
        if (thingsDao.updateEvent(e) < 1) httpResult.setResult(ESector51Result.ERROR);
      });
    });

    httpResult.setResult(result ? ESector51Result.OK : ESector51Result.ERROR);
    return httpResult;
  }
}