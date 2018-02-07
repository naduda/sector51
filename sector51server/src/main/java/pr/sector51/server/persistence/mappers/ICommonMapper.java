package pr.sector51.server.persistence.mappers;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import pr.sector51.server.persistence.model.Event;
import pr.sector51.server.persistence.model.History;

public interface ICommonMapper {
  @Select("SELECT EXISTS("
      + "SELECT * FROM information_schema.tables "
      + "WHERE table_schema = 'public' AND table_name = #{name})")
  boolean isTableExist(@Param("name")String name);

  @Insert("INSERT INTO event (id, name, description) VALUES(#{id}, #{name}, #{description});")
  void insertEvent(Event event);

  @Insert("INSERT INTO history(idevent, iduser, \"desc\") VALUES(#{idEvent}, #{idUser}, #{desc});")
  void insert2history(History history);
}
