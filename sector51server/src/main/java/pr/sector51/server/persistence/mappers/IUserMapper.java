package pr.sector51.server.persistence.mappers;

import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Component;
import pr.sector51.server.persistence.model.UserInfo;
import pr.sector51.server.persistence.model.UserSecurity;

import java.sql.Timestamp;
import java.util.List;

public interface IUserMapper {
  @Insert("INSERT INTO usersecurity(password, roles, created) VALUES (#{password}, #{roles}, #{created});\n" +
          "INSERT INTO userinfo(created, name, surname, phone, email, card, sex, birthday) \n" +
          "VALUES (#{created}, #{name}, #{surname}, #{phone}, #{email}, #{card}, #{sex}, #{birthday});" +
          "INSERT INTO barcode VALUES(100, #{card});" +
          "INSERT INTO user_service VALUES(#{abonServiceId}, #{created}, #{dtBeg_a}, #{dtEnd_a}, '');" +
          "INSERT INTO user_service VALUES(2, #{created}, #{dtBeg_b}, #{dtEnd_b}, #{boxNumber});")
  void insertImportedUser(@Param("created") Timestamp created, @Param("password") String password,
                          @Param("roles") String roles, @Param("name") String name, @Param("surname") String surname,
                          @Param("phone") String phone, @Param("email") String email, @Param("card") String card,
                          @Param("sex") boolean sex, @Param("birthday") Timestamp birthday,
                          @Param("abonServiceId") int abonServiceId, @Param("dtBeg_a") Timestamp dtBeg_a,
                          @Param("dtEnd_a") Timestamp dtEnd_a, @Param("dtBeg_b") Timestamp dtBeg_b,
                          @Param("dtEnd_b") Timestamp dtEnd_b, @Param("boxNumber") String boxNumber);

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

  @Insert("INSERT INTO userinfo(created, name, surname, phone, email, card, sex, birthday) "
          + "VALUES (#{created}, #{name}, #{surname}, #{phone}, #{email}, #{card}, #{sex}, #{birthday});")
  void insertUserInfo(UserInfo user);

  @Update("UPDATE barcode SET code = #{card} WHERE code = (SELECT card FROM userinfo WHERE created = #{created});" +
          "UPDATE userinfo SET name = #{name}, surname = #{surname}, phone = #{phone}, balance = #{balance}, " +
          "email = #{email}, card = #{card}, sex = #{sex}, birthday = #{birthday} WHERE created = #{created};")
  void updateUserInfo(UserInfo user);

  @Select("SELECT * FROM usersecurity;")
  List<UserSecurity> getUsersSecurity();

  @Select("SELECT * FROM usersecurity WHERE created = #{value}")
  UserSecurity getUserSecurityById(Timestamp value);

  @Select("SELECT ui.*, us.roles, us.password, box.number, box.time FROM usersecurity AS us, userinfo AS ui " +
          "LEFT JOIN box ON ui.card = box.card AND box.idtype < 3 WHERE us.created = ui.created;")
  List<UserInfo> getUsersInfo();

  @Select("SELECT ui.*, us.roles FROM usersecurity as us, userinfo as ui "
          + "WHERE ui.card = #{value} AND us.created = ui.created")
  UserInfo getUserInfoByCard(String value);

  @Select("SELECT * FROM userinfo WHERE email = #{value};")
  List<UserInfo> getUserInfoByEmail(String value);

  @Select("SELECT * FROM userinfo WHERE phone like #{value};")
  List<UserInfo> getUserInfoByPnone(String value);

  @Select("SELECT count(*) FROM usersecurity;")
  int getUsersCount();

  @Delete("DELETE FROM userinfo WHERE created IN (SELECT created FROM usersecurity WHERE roles <> 'OWNER');")
  int removeAllUsers();
}
