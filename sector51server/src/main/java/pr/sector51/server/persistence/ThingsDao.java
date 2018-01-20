package pr.sector51.server.persistence;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pr.sector51.server.persistence.mappers.IThingsMapper;
import pr.sector51.server.persistence.model.BoxNumber;
import pr.sector51.server.persistence.model.BoxType;
import pr.sector51.server.persistence.model.ESector51Result;
import pr.sector51.server.persistence.model.Sector51Result;

import java.sql.Timestamp;
import java.util.List;

@Service
public class ThingsDao extends CommonDao {
  @Autowired
  private IThingsMapper mapper;

  public Sector51Result removeBoxType(int id) {
    return new Sector51Result(mapper.removeBoxType(id) > 0 ? ESector51Result.OK : ESector51Result.ERROR);
  }

  public List<BoxType> getBoxTypes() {
    return mapper.getBoxTypes();
  }

  public List<BoxNumber> getBoxNumbers() {
    return mapper.getBoxNumbers();
  }

  public int insertBoxType(String boxType) {
    return mapper.insertBoxType(boxType);
  }

  public Sector51Result updateBoxType(BoxType boxType) {
    Sector51Result result = new Sector51Result(ESector51Result.OK);
    try {
      mapper.updateBoxType(boxType);
    } catch (Exception ex) {
      result.setMessage(ex.getMessage());
      result.setResult(ESector51Result.ERROR);
    }
    return result;
  }

  public int insertBoxNumber(BoxNumber boxNumber) {
    return mapper.insertBoxNumber(boxNumber);
  }

  public Sector51Result removeBoxNumber(BoxNumber boxNumber) {
    Sector51Result result = new Sector51Result(ESector51Result.ERROR);
    result.setMessage(boxNumber);
    result.setResult(mapper.removeBoxNumber(boxNumber) > 0 ? ESector51Result.OK : ESector51Result.ERROR);
    return result;
  }

  public Sector51Result updateBox(BoxNumber boxNumber) {
    Sector51Result result = new Sector51Result(ESector51Result.OK);
    try {
      boolean res = runTransaction(() -> {
        if (boxNumber.getCard() != null) {
          mapper.insert2history(0, boxNumber.getCard());
        } else {
          BoxNumber old = mapper.getBoxNumber(boxNumber.getIdtype(), boxNumber.getNumber());
          mapper.insert2history(1, old.getCard());
        }
        long time = mapper.updateBox(boxNumber);
        boxNumber.setTime(new Timestamp(time));
        result.setMessage(boxNumber);
      });
    } catch (Exception ex) {
      result.setResult(ESector51Result.ERROR);
      result.setMessage(ex.getMessage());
    }
    return result;
  }

  public void insert2history(int idEvent, String desc) {
    mapper.insert2history(idEvent, desc);
  }
}
