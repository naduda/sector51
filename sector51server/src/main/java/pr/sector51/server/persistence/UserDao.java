package pr.sector51.server.persistence;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import javax.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import pr.sector51.server.persistence.mappers.IUserMapper;
import pr.sector51.server.persistence.model.UserInfo;
import pr.sector51.server.persistence.model.UserInfoBuilder;
import pr.sector51.server.persistence.model.UserSecurity;
import pr.sector51.server.persistence.model.UserSecurityBuilder;
import pr.sector51.server.security.ERole;

@Service
public class UserDao extends CommonDao implements IUserMapper {
  public final static String TABLE_NAME = "usersecurity";
  public final static BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

  @Autowired
  private IUserMapper userMapper;

  @PostConstruct
  public void init() {
    if (!isTableExist(TABLE_NAME)) {
      boolean res = runTransaction(() -> {
        createTableUserSecurity();
        createTableUserInfo();
        insertUser(ERole.OWNER);
        createTableHistory();
        createTableEvents();
      });
      System.out.println("Table users was " + (res ? "" : "not ") + "created");
    }
  }

  @Override
  public void createTableUserSecurity() {
    userMapper.createTableUserSecurity();
  }

  @Override
  public void createTableUserInfo() {
    userMapper.createTableUserInfo();
  }

  @Override
  public void insertUserSecurity(UserSecurity user) {
    user.setPassword(encoder.encode(user.getPassword()));
    userMapper.insertUserSecurity(user);
  }

  @Override
  public void insertUserInfo(UserInfo user) {
    userMapper.insertUserInfo(user);
  }

  public void insertUser(ERole role) {
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
        .setEmail(role.name() + "@gmail.com")
        .setPhone("+380501234567").build();
    insertUserInfo(userInfo);
    System.out.println("User " + role.name() + " was inserted.");
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
    return userMapper.getUserInfoByCard(value);
  }
}
