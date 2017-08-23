package pr.sector51.server.persistence.mappers;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

public interface ICommonMapper {
  @Select("SELECT EXISTS("
      + "SELECT * FROM information_schema.tables "
      + "WHERE table_schema = 'public' AND table_name = #{name})")
  boolean isTableExist(@Param("name")String name);

  @Select("CREATE TABLE history ("
          + "eventId integer NOT NULL,"
          + "key character varying(13) NOT NULL,"
          + "time timestamp without time zone NOT NULL DEFAULT now()"
          + ");")
  void createTableHistory();

  @Select("CREATE TABLE events ("
          + "eventId integer NOT NULL,"
          + "text character varying(50) NOT NULL,"
          + "description character varying(50) NOT NULL"
          + ");")
  void createTableEvents();
}
