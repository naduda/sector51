package pr.sector51.server.persistence;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import pr.sector51.server.persistence.mappers.IScannerMapper;
import pr.sector51.server.persistence.mappers.ISqlMapper;
import pr.sector51.server.persistence.mappers.IUserMapper;
import pr.sector51.server.persistence.model.*;
import pr.sector51.server.security.ERole;

@Service
public class UserDao extends CommonDao implements IUserMapper {
  public final static String TABLE_NAME = "usersecurity";
  public static final int RESERVED_PRODUCTS_ID = 100;
  public final static BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

  @Autowired
  private ISqlMapper sqlMapper;

  @Autowired
  private IUserMapper userMapper;

  @Autowired
  private IScannerMapper scannerMapper;

  @Override
  public void insertUserSecurity(UserSecurity user) {
    user.setPassword(encoder.encode(user.getPassword()));
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
      insertUserInfo(userInfo);
      String card = userInfo.getCard() != null ? userInfo.getCard() : "0";
      scannerMapper.insertBarcode(RESERVED_PRODUCTS_ID, card);
    });
    return result ? ESector51Result.OK : ESector51Result.ERROR;
  }

  public ESector51Result updateUser(UserInfo userInfo){
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
    }
    finally {
      return Optional.ofNullable(user);
    }
  }

  @Override
  public UserInfo getUserInfoByCard(String value) {
    UserInfo user = userMapper.getUserInfoByCard(value);
    if (user != null) {
      user.setPassword(null);
    } else {
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
}
