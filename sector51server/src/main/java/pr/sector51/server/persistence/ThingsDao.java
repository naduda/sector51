package pr.sector51.server.persistence;

import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.stereotype.Service;
import pr.sector51.server.persistence.mappers.ICommonMapper;
import pr.sector51.server.persistence.mappers.IThingsMapper;
import pr.sector51.server.persistence.model.*;

import java.sql.Timestamp;
import java.util.List;

@Service
public class ThingsDao extends CommonDao {

    public ThingsDao(ICommonMapper commonMapper, DataSourceTransactionManager transactionManager,
                     IThingsMapper thingsMapper) {
        super(commonMapper, transactionManager, thingsMapper);
    }

    public boolean removeBoxType(int id) {
        return thingsMapper.removeBoxType(id) == 1;
    }

    public List<BoxType> getBoxTypes() {
        return thingsMapper.getBoxTypes();
    }

    public List<BoxNumber> getBoxNumbers() {
        return thingsMapper.getBoxNumbers();
    }

    public boolean updateBoxType(BoxType boxType) {
        return thingsMapper.updateBoxType(boxType) == 1;
    }

    public int insertBoxNumber(BoxNumber boxNumber) {
        return thingsMapper.insertBoxNumber(boxNumber);
    }

    public boolean removeBoxNumber(BoxNumber boxNumber) {
        int i = thingsMapper.removeBoxNumber(boxNumber);
        System.out.println(i);
        return i == 1;
    }

    public boolean updateBox(BoxNumber boxNumber) {
        long time = thingsMapper.updateBox(boxNumber);
        boxNumber.setTime(new Timestamp(time));
        return true;
    }

    public List<Service51> getServices() {
        return thingsMapper.getServices();
    }

    public List<UserService51> getUserServices(Timestamp idUser) {
        return thingsMapper.getUserServices(idUser);
    }

    public List<UserService51> getUserServices() {
        return thingsMapper.getAllUserServices();
    }

    public UserService51 insertUserService(UserService51 userServise) {
        return thingsMapper.insertUserService(userServise);
    }

    public int updateUserService(UserService51 userServise51) {
        return thingsMapper.updateUserService(userServise51);
    }

    public int removeUserService(long idUser, int idService) {
        Timestamp userId = new Timestamp(idUser);
        return thingsMapper.removeUserService(userId, idService);
    }

    public boolean updateService(Service51 service) {
        return thingsMapper.updateService(service) == 1;
    }

    public List<History> getHistory(Timestamp dtBeg, Timestamp dtEnd) {
        return thingsMapper.getHistory(dtBeg, dtEnd);
    }

    public List<Event> getEvents() {
        return thingsMapper.getEvents();
    }

    public int updateEvent(Event event) {
        return thingsMapper.updateEvent(event);
    }
}
