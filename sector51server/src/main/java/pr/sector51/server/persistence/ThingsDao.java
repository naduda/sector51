package pr.sector51.server.persistence;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pr.sector51.server.persistence.mappers.IThingsMapper;
import pr.sector51.server.persistence.model.*;

import java.sql.Timestamp;
import java.util.List;

@Service
public class ThingsDao extends CommonDao {
  @Autowired
  private IThingsMapper mapper;
  @Autowired
  private UserDao userDao;

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
        UserInfo user = null;
        int number = 0;
        if (boxNumber.getCard() != null) {
          user = userDao.getUserInfoByCard(boxNumber.getCard());
          number = boxNumber.getNumber();
        } else {
          BoxNumber old = mapper.getBoxNumber(boxNumber.getIdtype(), boxNumber.getNumber());
          user = userDao.getUserInfoByCard(old.getCard());
          number = old.getNumber();
        }
        History history = new History(boxNumber.getCard() != null ? 0 : 1, user.getCreated(), String.valueOf(number));
        insert2history(history);
        long time = mapper.updateBox(boxNumber);
        boxNumber.setTime(new Timestamp(time));
        result.setMessage(boxNumber);
      });
      result.setResult(res ? ESector51Result.OK : ESector51Result.ERROR);
    } catch (Exception ex) {
      result.setResult(ESector51Result.ERROR);
      result.setMessage(ex.getMessage());
    }
    return result;
  }

  public List<Service51> getServices() {
    return mapper.getServices();
  }

  public List<UserServise51> getUserServices(Timestamp idUser) {
    return mapper.getUserServices(idUser);
  }

  public UserServise51 insertUserService(UserServise51 userServise) {
    return mapper.insertUserService(userServise);
  }

  public int updateUserService(UserServise51 userServise51) {
    return mapper.updateUserService(userServise51);
  }

  public int removeUserService(long idUser, int idService) {
    return mapper.removeUserService(new Timestamp(idUser), idService);
  }

  public Sector51Result updateService(Service51 servise) {
    Sector51Result result = new Sector51Result(ESector51Result.OK);
    try {
      result.setResult(mapper.updateService(servise) > 0 ? ESector51Result.OK : ESector51Result.ERROR);
    } catch (Exception ex) {
      result.setMessage(ex.getMessage());
      result.setResult(ESector51Result.ERROR);
    }
    return result;
  }

  public List<History> getHistory() {
    return mapper.getHistory();
  }

  public List<Event> getEvents() {
    return mapper.getEvents();
  }
}
