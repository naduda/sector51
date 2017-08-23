package pr.sector51.server.persistence.mappers;

import java.sql.Timestamp;
import java.util.List;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Component;
import pr.sector51.server.persistence.model.UserInfo;
import pr.sector51.server.persistence.model.UserSecurity;

public interface IUserMapper {
  @Select("CREATE TABLE usersecurity ("
      + "username character varying(100) NOT NULL,"
      + "password character varying(100) NOT NULL,"
      + "roles character varying(100) NOT NULL,"
      + "accountNonExpired boolean,"
      + "accountNonLocked boolean,"
      + "credentialsNonExpired boolean,"
      + "enabled boolean,"
      + "attempts integer NOT NULL DEFAULT 0,"
      + "lastmodified timestamp without time zone NOT NULL DEFAULT now(),"
      + "created timestamp without time zone NOT NULL DEFAULT now(),"
      + "CONSTRAINT pk_user_security PRIMARY KEY (created),"
      + "CONSTRAINT pk_login UNIQUE (username)"
      + ");")
  void createTableUserSecurity();

  @Select("CREATE TABLE userinfo ("
      + "created timestamp without time zone NOT NULL DEFAULT now(),"
      + "name character varying(100) NOT NULL,"
      + "surname character varying(100) NOT NULL,"
      + "phone character varying(100) NOT NULL,"
      + "email character varying(100) NOT NULL,"
      + "card character varying(15),"
      + "CONSTRAINT pk_user_info PRIMARY KEY (created)"
      + ");")
  void createTableUserInfo();

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
}
