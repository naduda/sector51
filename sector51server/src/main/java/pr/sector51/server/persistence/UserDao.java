package pr.sector51.server.persistence;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import javax.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
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
  public final static BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

  @Autowired
  private ISqlMapper sqlMapper;

  @Autowired
  private IUserMapper userMapper;

  @Autowired
  private IScannerMapper scannerMapper;

  @PostConstruct
  public void init() {
    List<UserInfo> users = userMapper.getUsersInfo();
    if (users.size() == 0) {
      boolean res = runTransaction(() -> {
        insertUser(ERole.OWNER);
        scannerMapper.insertBarcode(10, 1);
        insertEvent(new Event(EEvent.SCANNER.getId(), EEvent.SCANNER.name()));
      });
      System.out.println("\n\n\tTable users was " + (res ? "" : "not ") + "created\n\n");
    }
    if (isTableExist(TABLE_NAME)) {
      return;
    }
    Resource resource = new ClassPathResource("createDataBase.sql");
    StringBuilder sqlBuilder = new StringBuilder("");
    try(BufferedInputStream inputStream = new BufferedInputStream(resource.getInputStream())) {
      byte[] contents = new byte[1024];

      int bytesRead;

      while((bytesRead = inputStream.read(contents)) != -1) {
        sqlBuilder.append(new String(contents, 0, bytesRead));
      }
    } catch (IOException ex) {
      System.out.println(ex);
    }

    boolean res = runTransaction(() -> {
      if (sqlBuilder.toString().length() > 0) {
        sqlMapper.execute(sqlBuilder.toString());
      }
      insertUser(ERole.OWNER);
      insertEvent(new Event(EEvent.SCANNER.getId(), EEvent.SCANNER.name()));
    });
    System.out.println("Table users was " + (res ? "" : "not ") + "created");
  }

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
    userMapper.insertUserInfo(user);
  }

  @Override
  public void updateUserInfo(UserInfo user) {
    userMapper.updateUserInfo(user);
  }

  private void insertUser(ERole role) {
    UserSecurity user = new UserSecurityBuilder()
        .setUsername(role.name().toLowerCase())
        .setPassword(role.name().toLowerCase())
        .setRoles(role.name())
        .build();
    insertUserSecurity(user);
    UserInfo userInfo = new UserInfoBuilder()
        .setLogin(role.name().toLowerCase())
        .setCreated(user.getCreated())
        .setName("Name" + role.name())
        .setSurname("Surname" + role.name())
        .setEmail(role.name().toLowerCase() + "@gmail.com")
        .setPhone("+380501234567")
        .setCard("1")
        .setRoles(user.getRoles()).build();
    insertUserInfo(userInfo);
  }

  public ESector51Result insertUser(UserInfo userInfo) {
    UserSecurity userExist = userMapper.getUserSecurityById(userInfo.getCreated());
    if (userExist != null) {
      return ESector51Result.USER_ALREADY_EXIST;
    }
    boolean result = runTransaction(() -> {
      UserSecurity user = new UserSecurityBuilder()
              .setPassword(userInfo.getPassword())
              .setRoles(userInfo.getRoles())
              .build();
      insertUserSecurity(user);
      userInfo.setCreated(user.getCreated());
      insertUserInfo(userInfo);
      scannerMapper.insertBarcode(10, Long.parseLong(userInfo.getCard()));
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
  public UserSecurity getUserSecurityByName(String name) {
    return userMapper.getUserSecurityByName(name);
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
  public UserInfo getUserInfoById(Timestamp value) {
    return userMapper.getUserInfoById(value);
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
}
