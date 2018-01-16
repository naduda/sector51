package pr.sector51.server.web.rest;

import org.apache.ibatis.annotations.Insert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pr.sector51.server.persistence.ThingsDao;
import pr.sector51.server.persistence.model.BoxNumber;
import pr.sector51.server.persistence.model.BoxType;
import pr.sector51.server.persistence.model.ESector51Result;
import pr.sector51.server.persistence.model.Sector51Result;

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

  // GET ==============================================================================
  @RequestMapping("/boxtypes")
  public List<BoxType> boxtypes() {
    return thingsDao.getBoxTypes();
  }

  @RequestMapping("/boxnumbers")
  public List<BoxNumber> boxnumbers() {
    return thingsDao.getBoxNumbers();
  }

  // POST ============================================================================
  @RequestMapping(value = "/add/boxType", method = RequestMethod.POST)
  public Sector51Result insertBoxType(@RequestBody String boxTypeName) {
    Sector51Result result = new Sector51Result(ESector51Result.OK);
    int id = thingsDao.insertBoxType(boxTypeName);
    result.setMessage(id);
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
    return thingsDao.updateBox(boxNumber);
  }
}