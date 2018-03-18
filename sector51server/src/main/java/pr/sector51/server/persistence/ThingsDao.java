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
  private UserDao userDao;

  public Sector51Result removeBoxType(int id) {
    return new Sector51Result(thingsMapper.removeBoxType(id) > 0 ? ESector51Result.OK : ESector51Result.ERROR);
  }

  public List<BoxType> getBoxTypes() {
    return thingsMapper.getBoxTypes();
  }

  public List<BoxNumber> getBoxNumbers() {
    return thingsMapper.getBoxNumbers();
  }

  public int insertBoxType(String boxType) {
    return thingsMapper.insertBoxType(boxType);
  }

  public Sector51Result updateBoxType(BoxType boxType) {
    Sector51Result result = new Sector51Result(ESector51Result.OK);
    try {
      thingsMapper.updateBoxType(boxType);
    } catch (Exception ex) {
      result.setMessage(ex.getMessage());
      result.setResult(ESector51Result.ERROR);
    }
    return result;
  }

  public int insertBoxNumber(BoxNumber boxNumber) {
    return thingsMapper.insertBoxNumber(boxNumber);
  }

  public Sector51Result removeBoxNumber(BoxNumber boxNumber) {
    Sector51Result result = new Sector51Result(ESector51Result.ERROR);
    result.setMessage(boxNumber);
    result.setResult(thingsMapper.removeBoxNumber(boxNumber) > 0 ? ESector51Result.OK : ESector51Result.ERROR);
    return result;
  }

  public Sector51Result updateBox(BoxNumber boxNumber, boolean withHistory) {
    Sector51Result result = new Sector51Result(ESector51Result.OK);
    try {
      boolean res = runTransaction(() -> {
        UserInfo user = null;
        int number = 0;
        if (boxNumber.getCard() != null) {
          user = userDao.getUserInfoByCard(boxNumber.getCard());
          number = boxNumber.getNumber();
        } else {
          BoxNumber old = thingsMapper.getBoxNumber(boxNumber.getIdtype(), boxNumber.getNumber());
          user = userDao.getUserInfoByCard(old.getCard());
          number = old.getNumber();
        }
        if (withHistory) {
          History history = new History(boxNumber.getCard() != null ? 0 : 1, user.getCreated(), String.valueOf(number));
          insert2history(history);
        }
        long time = thingsMapper.updateBox(boxNumber);
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
    return thingsMapper.getServices();
  }

  public List<UserServise51> getUserServices(Timestamp idUser) {
    return thingsMapper.getUserServices(idUser);
  }

  public UserServise51 insertUserService(UserServise51 userServise) {
    return thingsMapper.insertUserService(userServise);
  }

  public int updateUserService(UserServise51 userServise51) {
    return thingsMapper.updateUserService(userServise51);
  }

  public int removeUserService(long idUser, int idService) {
    int[] result = new int[1];
    boolean res = runTransaction(() -> {
      Timestamp userId = new Timestamp(idUser);
      if (idService == 2) {
        UserServise51 uService = getUserServices(userId).stream()
                .filter(us -> us.getIdService() == idService).findFirst().get();
        BoxNumber boxNumber = new BoxNumber(3, Integer.parseInt(uService.getValue()));
        updateBox(boxNumber, false);
      }
      result[0] = thingsMapper.removeUserService(userId, idService);
    });
    return result[0];
  }

  public Sector51Result updateService(Service51 servise) {
    Sector51Result result = new Sector51Result(ESector51Result.OK);
    try {
      result.setResult(thingsMapper.updateService(servise) > 0 ? ESector51Result.OK : ESector51Result.ERROR);
    } catch (Exception ex) {
      result.setMessage(ex.getMessage());
      result.setResult(ESector51Result.ERROR);
    }
    return result;
  }

  public List<History> getHistory(Timestamp dtBeg, Timestamp dtEnd) {
    return thingsMapper.getHistory(dtBeg, dtEnd);
  }

  public List<Event> getEvents() {
    return thingsMapper.getEvents();
  }
}
