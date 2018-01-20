package pr.sector51.server.persistence.mappers;

import java.sql.Timestamp;
import java.util.List;

import org.apache.ibatis.annotations.*;
import pr.sector51.server.persistence.model.UserInfo;
import pr.sector51.server.persistence.model.UserSecurity;

public interface IUserMapper {
  @Insert("INSERT INTO usersecurity(password, roles, accountNonExpired, accountNonLocked,"
      + "credentialsNonExpired, enabled, created) "
      + "VALUES (#{password}, #{roles}, #{accountNonExpired}, #{accountNonLocked}, "
      + "#{credentialsNonExpired}, #{enabled}, #{created})")
  void insertUserSecurity(UserSecurity user);

  @Update("UPDATE usersecurity SET password = #{password}, roles = #{roles}," +
          "attempts = 0, lastmodified = now() WHERE created = #{created};")
  void updateUserSecurity(UserInfo user);

  @Delete("DELETE FROM barcode WHERE code = (SELECT card from userinfo WHERE created = #{created});" +
          "DELETE FROM usersecurity WHERE created = #{created};" +
          "DELETE FROM userinfo WHERE created = #{created};")
  int deleteUser(@Param("created") Timestamp created);

  @Insert("INSERT INTO userinfo(created, name, surname, phone, email, card, sex) "
      + "VALUES (#{created}, #{name}, #{surname}, #{phone}, #{email}, #{card}, #{sex});")
  void insertUserInfo(UserInfo user);

  @Update("UPDATE barcode SET code = #{card} WHERE code = (SELECT card FROM userinfo WHERE created = #{created});" +
          "UPDATE userinfo SET name = #{name}, surname = #{surname}, phone = #{phone}," +
          "email = #{email}, card = #{card}, sex = #{sex}, balance = #{balance} WHERE created = #{created};")
  void updateUserInfo(UserInfo user);

  @Select("SELECT * FROM usersecurity;")
  List<UserSecurity> getUsersSecurity();

  @Select("SELECT * FROM usersecurity WHERE created = #{value}")
  UserSecurity getUserSecurityById(Timestamp value);

  @Select("SELECT ui.*, us.roles, box.number, box.time FROM usersecurity AS us, userinfo AS ui " +
      "LEFT JOIN box ON ui.card = box.card WHERE us.created = ui.created;")
  List<UserInfo> getUsersInfo();

  @Select("SELECT ui.*, us.roles FROM usersecurity as us, userinfo as ui "
      + "WHERE ui.created = #{value} AND us.created = ui.created")
  UserInfo getUserInfoById(Timestamp value);

  @Select("SELECT ui.*, us.roles FROM usersecurity as us, userinfo as ui "
      + "WHERE ui.card = #{value} AND us.created = ui.created")
  UserInfo getUserInfoByCard(String value);

  @Select("SELECT * FROM userinfo WHERE email = #{value};")
  List<UserInfo> getUserInfoByEmail(String value);

  @Select("SELECT * FROM userinfo WHERE phone like #{value};")
  List<UserInfo> getUserInfoByPnone(String value);

  @Select("SELECT count(*) FROM usersecurity;")
  int getUsersCount();
}
