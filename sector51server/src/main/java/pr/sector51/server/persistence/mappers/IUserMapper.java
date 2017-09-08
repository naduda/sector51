package pr.sector51.server.persistence.mappers;

import java.sql.Time;
import java.sql.Timestamp;
import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import pr.sector51.server.persistence.model.Permition;
import pr.sector51.server.persistence.model.UserInfo;
import pr.sector51.server.persistence.model.UserSecurity;

public interface IUserMapper {
  @Insert("INSERT INTO usersecurity(username, password, roles, accountNonExpired, accountNonLocked,"
      + "credentialsNonExpired, enabled, created) "
      + "VALUES (#{username}, #{password}, #{roles}, #{accountNonExpired}, #{accountNonLocked}, "
      + "#{credentialsNonExpired}, #{enabled}, #{created})")
  void insertUserSecurity(UserSecurity user);

  @Insert("INSERT INTO userinfo(created, name, surname, phone, email, card) "
      + "VALUES (#{created}, #{name}, #{surname}, #{phone}, #{email}, #{card})")
  void insertUserInfo(UserInfo user);

  @Select("SELECT * FROM usersecurity")
  List<UserSecurity> getUsersSecurity();

  @Select("SELECT * FROM usersecurity WHERE username = #{value}")
  UserSecurity getUserSecurityByName(String value);

  @Select("SELECT * FROM usersecurity WHERE created = #{value}")
  UserSecurity getUserSecurityById(Timestamp value);

  @Select("SELECT us.username as login, ui.*, us.roles FROM usersecurity as us, userinfo as ui "
      + "WHERE ui.created = #{value} AND us.created = ui.created")
  UserInfo getUserInfoById(Timestamp value);

  @Select("SELECT us.username as login, ui.*, us.roles FROM usersecurity as us, userinfo as ui "
      + "WHERE ui.card = #{value} AND us.created = ui.created")
  UserInfo getUserInfoByCard(String value);

  @Select("SELECT * FROM permition;")
  List<Permition> allPermitions();

  @Insert("INSERT INTO user_permition(iduser, idpermition) VALUES (#{idUser}, #{idPermition})")
  int insertUserPermitions(@Param("idUser") Timestamp idUser, @Param("idPermition")int idPermition);

  @Select("SELECT idpermition FROM user_permition WHERE iduser = #{idUser}")
  List<Integer> getUserPermitions(@Param("idUser") Timestamp idUser);
}
