package pr.sector51.server.persistence.mappers;

import java.sql.Timestamp;
import java.util.List;

import org.apache.ibatis.annotations.*;
import pr.sector51.server.persistence.model.UserInfo;
import pr.sector51.server.persistence.model.UserSecurity;

public interface IUserMapper {
  @Insert("INSERT INTO usersecurity(username, password, roles, accountNonExpired, accountNonLocked,"
      + "credentialsNonExpired, enabled, created) "
      + "VALUES (#{username}, #{password}, #{roles}, #{accountNonExpired}, #{accountNonLocked}, "
      + "#{credentialsNonExpired}, #{enabled}, #{created})")
  void insertUserSecurity(UserSecurity user);

  @Update("UPDATE usersecurity SET password = #{password}, roles = #{roles}," +
          "attempts = 0, lastmodified = now() WHERE created = #{created};")
  void updateUserSecurity(UserInfo user);

  @Delete("DELETE FROM usersecurity WHERE created = #{created};" +
          "DELETE FROM userinfo WHERE created = #{created};")
  void deleteUser(@Param("created") Timestamp created);

  @Insert("INSERT INTO userinfo(created, name, surname, phone, email, card, sex) "
      + "VALUES (#{created}, #{name}, #{surname}, #{phone}, #{email}, #{card}, #{sex});")
  void insertUserInfo(UserInfo user);

  @Update("UPDATE userinfo SET name = #{name}, surname = #{surname}, phone = #{phone}," +
          "email = #{email}, card = #{card}, sex = #{sex} WHERE created = #{created};")
  void updateUserInfo(UserInfo user);

  @Select("SELECT * FROM usersecurity;")
  List<UserSecurity> getUsersSecurity();

  @Select("SELECT * FROM usersecurity WHERE username = #{value}")
  UserSecurity getUserSecurityByName(String value);

  @Select("SELECT * FROM usersecurity WHERE created = #{value}")
  UserSecurity getUserSecurityById(Timestamp value);

  @Select("SELECT us.username as login, ui.*, us.roles FROM usersecurity as us, userinfo as ui " +
          "WHERE us.created = ui.created")
  List<UserInfo> getUsersInfo();

  @Select("SELECT us.username as login, ui.*, us.roles FROM usersecurity as us, userinfo as ui "
      + "WHERE ui.created = #{value} AND us.created = ui.created")
  UserInfo getUserInfoById(Timestamp value);

  @Select("SELECT us.username as login, ui.*, us.roles FROM usersecurity as us, userinfo as ui "
      + "WHERE ui.card = #{value} AND us.created = ui.created")
  UserInfo getUserInfoByCard(String value);
}
