package pr.sector51.server.persistence;

import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import pr.sector51.server.persistence.mappers.ICommonMapper;
import pr.sector51.server.persistence.mappers.IThingsMapper;
import pr.sector51.server.persistence.mappers.IUserMapper;
import pr.sector51.server.persistence.model.ESector51Result;
import pr.sector51.server.persistence.model.UserInfo;
import pr.sector51.server.persistence.model.UserSecurity;
import pr.sector51.server.persistence.model.UserSecurityBuilder;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Service
public class UserDao extends CommonDao implements IUserMapper {
    public static final int RESERVED_PRODUCTS_ID = 100;
    public final static BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    private IUserMapper userMapper;

    public UserDao(ICommonMapper commonMapper, DataSourceTransactionManager transactionManager,
                   IThingsMapper thingsMapper, IUserMapper userMapper) {
        super(commonMapper, transactionManager, thingsMapper);
        this.userMapper = userMapper;
    }

    @Override
    public void insertImportedUser(Timestamp created, String password, String roles, String name, String surname,
                                   String phone, String email, String card, boolean sex, Timestamp birthday,
                                   int abonServiceId, Timestamp dtBeg_a, Timestamp dtEnd_a, Timestamp dtBeg_b,
                                   Timestamp dtEnd_b, String boxNumber) {
        if (!password.startsWith("|")) {
            password = encoder.encode(password);
        }
        userMapper.insertImportedUser(created, password, roles, name, surname, phone, email, card, sex, birthday,
                abonServiceId, dtBeg_a, dtEnd_a, dtBeg_b, dtEnd_b, boxNumber);
    }

    @Override
    public void insertUserSecurity(UserSecurity user) {
        if (user.getPassword().startsWith("|")) {
            user.setPassword(user.getPassword().substring(1));
        } else {
            user.setPassword(encoder.encode(user.getPassword()));
        }
        userMapper.insertUserSecurity(user);
    }

    @Override
    public void updateUserSecurity(UserInfo user) {
        userMapper.updateUserSecurity(user);
    }

    @Override
    public int deleteUser(Timestamp created) {
        return userMapper.deleteUser(created);
    }

    public ESector51Result removeUser(long created) {
        try {
            return deleteUser(new Timestamp(created)) == 1 ? ESector51Result.OK : ESector51Result.ERROR;
        } catch (Exception e) {
            return ESector51Result.ERROR;
        }
    }

    @Override
    public void insertUserInfo(UserInfo user) {
        if (user.getEmail() == null) user.setEmail("");
        userMapper.insertUserInfo(user);
    }

    @Override
    public void updateUserInfo(UserInfo user) {
        userMapper.updateUserInfo(user);
    }

    public ESector51Result insertUser(UserInfo userInfo) {
        UserSecurity userExist = userMapper.getUserSecurityById(userInfo.getCreated());
        if (userExist != null) {
            return ESector51Result.USER_ALREADY_EXIST;
        }
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserSecurity currentUserSecurity = auth != null ? (UserSecurity) auth.getDetails() : null;

        boolean result = runTransaction(() -> {
            UserSecurity user = new UserSecurityBuilder()
                    .setPassword(userInfo.getPassword())
                    .setRoles(userInfo.getRoles())
                    .build();

            if (currentUserSecurity != null && user.getRole().value < currentUserSecurity.getRole().value) {
                return;
            }
            insertUserSecurity(user);
            userInfo.setCreated(user.getCreated());
            if (userInfo.getCard() == null || userInfo.getCard().trim().isEmpty()) {
                userInfo.setCard(String.valueOf(System.currentTimeMillis()));
            }
            insertUserInfo(userInfo);
        });
        return result ? ESector51Result.OK : ESector51Result.ERROR;
    }

    public ESector51Result updateUser(UserInfo userInfo) {
        UserSecurity userExist = userMapper.getUserSecurityById(userInfo.getCreated());
        if (userInfo.getPassword() == null) {
            userInfo.setPassword(userExist.getPassword());
        } else {
            userInfo.setPassword(encoder.encode(userInfo.getPassword()));
        }
        boolean result = runTransaction(() -> {
            updateUserSecurity(userInfo);
            updateUserInfo(userInfo);
        });
        return result ? ESector51Result.OK : ESector51Result.ERROR;
    }

    @Override
    public List<UserSecurity> getUsersSecurity() {
        return userMapper.getUsersSecurity();
    }

    @Override
    public UserSecurity getUserSecurityById(Timestamp stamp) {
        return userMapper.getUserSecurityById(stamp);
    }

    @Override
    public List<UserInfo> getUsersInfo() {
        return userMapper.getUsersInfo();
    }

    public Optional<UserSecurity> getUserSecurityById(String id) {
        UserSecurity user = null;
        try {
            long value = Long.parseLong(id);
            user = getUserSecurityById(new Timestamp(value));
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return Optional.ofNullable(user);
    }

    @Override
    public UserInfo getUserInfoByCard(String value) {
        UserInfo user = userMapper.getUserInfoByCard(value);
        if (user == null) {
            user = new UserInfo();
        }
        return user;
    }

    @Override
    public List<UserInfo> getUserInfoByEmail(String value) {
        return userMapper.getUserInfoByEmail(value);
    }

    @Override
    public List<UserInfo> getUserInfoByPnone(String value) {
        value = value
                .replaceAll(" ", "")
                .replaceAll("\\(", "")
                .replaceAll("\\)", "")
                .replaceAll("-", "");
        return userMapper.getUserInfoByPnone("%" + value);
    }

    @Override
    public int getUsersCount() {
        return userMapper.getUsersCount();
    }

    public int removeAllUsers() {
        return userMapper.removeAllUsers();
    }
}
