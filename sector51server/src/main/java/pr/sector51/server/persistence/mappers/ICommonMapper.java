package pr.sector51.server.persistence.mappers;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import pr.sector51.server.persistence.model.Event;
import pr.sector51.server.persistence.model.History;
import pr.sector51.server.persistence.model.UserInfo;

import java.sql.Timestamp;

public interface ICommonMapper {
  @Select("SELECT EXISTS("
      + "SELECT * FROM information_schema.tables "
      + "WHERE table_schema = 'public' AND table_name = #{name})")
  boolean isTableExist(@Param("name") String name);

  @Select("SELECT ui.*, us.roles FROM usersecurity as us, userinfo as ui "
          + "WHERE ui.created = #{value} AND us.created = ui.created")
  UserInfo getUserInfoById(Timestamp value);

  @Insert("INSERT INTO event (id, name, description) VALUES(#{id}, #{name}, #{description});")
  void insertEvent(Event event);

  @Insert("INSERT INTO history(idEvent, idUser, \"desc\", income, outcome, usercome) " +
          "VALUES(#{idEvent}, #{idUser}, #{desc}, #{income}, #{outcome}, #{usercome});")
  void insert2history(History history);

  @Select("SELECT * FROM event WHERE id = #{id};")
  Event getEventById(@Param("id") int id);

  @Update("UPDATE history SET usercome = #{usercome} WHERE id IN(SELECT max(id) FROM history);")
  void updateLastHistoryUsercome(@Param("usercome") int newBalance);
}
