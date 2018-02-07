package pr.sector51.server.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pr.sector51.server.persistence.ThingsDao;
import pr.sector51.server.persistence.model.*;

import java.sql.Timestamp;
import java.util.List;

@RequestMapping("/api")
@RestController
public class RestThingsController extends RestCommon {
  @Autowired
  private ThingsDao thingsDao;

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

  @RequestMapping("/history")
  public List<History> history() {
    return thingsDao.getHistory();
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
  @RequestMapping(value = "/add/boxType", method = RequestMethod.POST)
  public Sector51Result insertBoxType(@RequestBody String boxTypeName) {
    Sector51Result result = new Sector51Result(ESector51Result.OK);
    int id = thingsDao.insertBoxType(boxTypeName);
    result.setMessage(id);
    return result;
  }

  @RequestMapping(value = "/add/userservice", method = RequestMethod.POST)
  public Sector51Result userService(@RequestBody UserServise51 userService) {
    Sector51Result result = new Sector51Result(ESector51Result.OK);
    try {
      boolean trResult = thingsDao.runTransaction(() -> {
        UserServise51 inserted = thingsDao.insertUserService(userService);
        History history = new History(2, inserted.getIdUser(), inserted.getIdService() + "_" + userService.getDesc());
        thingsDao.insert2history(history);
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

  @RequestMapping(value = "/add/history", method = RequestMethod.POST)
  public Sector51Result addHistory(@RequestBody History history) {
    Sector51Result result = new Sector51Result(ESector51Result.ERROR);
    try {
      thingsDao.insert2history(history);
      result.setResult(ESector51Result.OK);
    } catch (Exception ex) {
      result.setMessage(ex.getMessage());
    }
    return result;
  }

  // PUT =============================================================================
  @RequestMapping(value = "/update/boxType", method = RequestMethod.PUT)
  public Sector51Result updateBoxtype(@RequestBody BoxType boxType) {
    return thingsDao.updateBoxType(boxType);
  }

  @RequestMapping(value = "/update/boxNumber", method = RequestMethod.PUT)
  public Sector51Result updateBox(@RequestBody BoxNumber boxNumber) {
    return thingsDao.updateBox(boxNumber);
  }

  @RequestMapping(value = "/update/userservice", method = RequestMethod.PUT)
  public Sector51Result updateBox(@RequestBody UserServise51 userService) {
    boolean trResult = thingsDao.runTransaction(() -> {
      int updated = thingsDao.updateUserService(userService);
      History history = new History(3, userService.getIdUser(), userService.getIdService() + "_" + userService.getDesc());
      thingsDao.insert2history(history);
    });
    return new Sector51Result(trResult ? ESector51Result.OK : ESector51Result.ERROR);
  }

  @RequestMapping(value = "/update/service", method = RequestMethod.PUT)
  public Sector51Result updateService(@RequestBody Service51 servise) {
    return thingsDao.updateService(servise);
  }
}