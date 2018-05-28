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
    Sector51Result result = new Sector51Result(ESector51Result.OK);
    List<Integer> status = new ArrayList<>(rows.size());
    for (int i = 0; i < rows.size(); i++) {
      Map<String, String> data = rows.get(i);
      status.add(1);

      try {
        String birthday = data.get("birthday");

        UserInfo userInfo = new UserInfoBuilder()
                .setRoles(data.getOrDefault("user_type", "USER"))
                .setBalance(0)
                .setEmail(data.getOrDefault("email", ""))
                .setName(data.get("name"))
                .setSurname(data.get("surname"))
                .setPhone(data.get("phone"))
                .setSex(data.get("sex").toUpperCase() == "M" || data.get("sex").toUpperCase() == "М")
                .setCard(data.get("card"))
                .setPassword(data.getOrDefault("password", data.get("card")))
                .build();

        if (birthday != null) {
          userInfo.setBirthday(getTimestampFromString(birthday));
        }
        ESector51Result userResult = userDao.insertUser(userInfo);

        if (userResult != ESector51Result.OK) {
          status.set(i, 0);
          continue;
        }

        boolean servicesResult = userDao.runTransaction(() -> {
          String abonDate = data.get("dtbeg_a");
          if (abonDate != null) {
            String abontype = data.getOrDefault("abontype", "M");
            UserServise51 service = new UserServise51();
            service.setIdService(abontype == "M" ? 3 : abonDate == "E" ? 4 : 0);
            service.setIdUser(userInfo.getCreated());
            service.setDtBeg(getTimestampFromString(data.get("dtbeg_a")));
            service.setDtEnd(getTimestampFromString(data.get("dtend_a")));
            userService(service);
          }

          String boxDate = data.get("dtbeg_b");
          if (boxDate != null) {
            String boxNumber = data.getOrDefault("box", "0");
            UserServise51 service = new UserServise51();
            service.setIdService(2);
            service.setIdUser(userInfo.getCreated());
            service.setDtBeg(getTimestampFromString(data.get("dtbeg_b")));
            service.setDtEnd(getTimestampFromString(data.get("dtend_b")));
            service.setValue(boxNumber);
            userService(service);
          }
        });

        if (!servicesResult) {
          userDao.removeUser(userInfo.getCreated().getTime());
          status.set(i, 0);
        }
      } catch (Exception ex) {
        status.set(i, 0);
      }
    }
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