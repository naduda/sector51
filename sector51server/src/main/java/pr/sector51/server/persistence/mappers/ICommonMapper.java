package pr.sector51.server.persistence.mappers;

import org.apache.ibatis.annotations.*;
import pr.sector51.server.persistence.CommonDao;
import pr.sector51.server.persistence.model.Event;
import pr.sector51.server.persistence.model.UserInfo;

import java.sql.Timestamp;

public interface ICommonMapper {
  @SelectProvider(type = CommonDao.class, method = "getQuery")
  void update(@Param("query") String query);

  @Select("SELECT EXISTS("
          + "SELECT * FROM information_schema.tables "
          + "WHERE table_schema = 'public' AND table_name = #{name})")
  boolean isTableExist(@Param("name") String name);

  @Select("SELECT ui.*, us.roles FROM usersecurity as us, userinfo as ui "
          + "WHERE ui.created = #{value} AND us.created = ui.created")
  UserInfo getUserInfoById(Timestamp value);

  @Insert("INSERT INTO event (id, name, description) VALUES(#{id}, #{name}, #{description});")
  void insertEvent(Event event);

  @Update("UPDATE history SET usercome = #{usercome} WHERE id IN(SELECT max(id) FROM history);")
  void updateLastHistoryUsercome(@Param("usercome") int newBalance);
}
