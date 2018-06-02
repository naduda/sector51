package pr.sector51.server.persistence.mappers;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import pr.sector51.server.persistence.model.*;

import java.sql.Timestamp;
import java.util.List;

public interface IThingsMapper {
  @Select("SELECT * FROM boxtype;")
  List<BoxType> getBoxTypes();

  @Select("SELECT * FROM box;")
  List<BoxNumber> getBoxNumbers();

  @Select("SELECT * FROM history WHERE time BETWEEN #{dtBeg} AND #{dtEnd} ORDER BY time;")
  List<History> getHistory(@Param("dtBeg") Timestamp dtBeg, @Param("dtEnd") Timestamp dtEnd);

  @Delete("DELETE FROM boxtype WHERE id = #{id}; DELETE FROM box WHERE idtype = #{id};")
  int removeBoxType(@Param("id") int id);

  @Update("UPDATE boxtype set name = #{name} WHERE id = #{id};")
  void updateBoxType(BoxType boxType);

  @Select("INSERT INTO boxtype VALUES((SELECT count(*) + 1 FROM boxtype), #{name}) RETURNING id;")
  int insertBoxType(@Param("name") String boxType);

  @Select("INSERT INTO box VALUES(#{idtype}, #{number}) RETURNING number;")
  int insertBoxNumber(BoxNumber boxNumber);

  @Select("DELETE FROM box WHERE idtype = #{idtype} AND number = #{number} RETURNING number;")
  int removeBoxNumber(BoxNumber boxNumber);

  @Select("UPDATE box set card = #{card}, time = now() WHERE idtype = #{idtype} AND number = #{number} " +
          "RETURNING extract(epoch from now()) * 1000;")
  long updateBox(BoxNumber boxNumber);

  @Select("SELECT * FROM box WHERE idtype = #{idtype} and \"number\" = #{number};")
  BoxNumber getBoxNumber(@Param("idtype") int idtype, @Param("number") int number);

  @Select("SELECT * FROM service ORDER BY name;")
  List<Service51> getServices();

  @Select("SELECT us.*, s.name as \"desc\" FROM user_service AS us LEFT JOIN service AS s ON s.id = us.idservice " +
          "WHERE us.idUser = #{idUser};")
  List<UserServise51> getUserServices(@Param("idUser") Timestamp idUser);

  @Select("INSERT INTO user_service VALUES(#{idService}, #{idUser}, #{dtBeg}, #{dtEnd}, #{value}) RETURNING *;")
  UserServise51 insertUserService(UserServise51 userServise);

  @Update("UPDATE user_service set dtbeg = #{dtBeg}, dtend = #{dtEnd}, value = #{value} " +
          "WHERE iduser = #{idUser} and idservice = #{idService};")
  int updateUserService(UserServise51 userServise51);

  @Delete("DELETE FROM user_service WHERE iduser = #{idUser} AND idservice = #{idService};")
  int removeUserService(@Param("idUser") Timestamp idUser, @Param("idService") int idService);

  @Update("UPDATE service SET name = #{name}, \"desc\" = #{desc}, price = #{price} WHERE id = #{id};")
  int updateService(Service51 servise);

  @Select("SELECT * FROM event;")
  List<Event> getEvents();

  @Update("UPDATE event SET name = #{name}, \"desc\" = #{desc}, email = #{email} WHERE id = #{id};")
  int updateEvent(Event event);
}
