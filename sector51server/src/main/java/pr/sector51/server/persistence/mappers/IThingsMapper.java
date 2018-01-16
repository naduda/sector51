package pr.sector51.server.persistence.mappers;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import pr.sector51.server.persistence.model.BoxNumber;
import pr.sector51.server.persistence.model.BoxType;

import java.util.List;

public interface IThingsMapper {
  @Select("SELECT * FROM boxtype;")
  List<BoxType> getBoxTypes();

  @Select("SELECT * FROM box;")
  List<BoxNumber> getBoxNumbers();

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
}
