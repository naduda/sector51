package pr.sector51.server.persistence.mappers;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectProvider;
import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Component;
import pr.sector51.server.persistence.model.UserInfo;

import java.sql.Timestamp;

@Component
public interface ICommonMapper {
    @SelectProvider(type = UpdateProvider.class, method = "getQuery")
    void update(@Param("query") String query);

    @Select("SELECT ui.*, us.roles FROM usersecurity as us, userinfo as ui "
            + "WHERE ui.created = #{value} AND us.created = ui.created")
    UserInfo getUserInfoById(Timestamp value);

    @Update("UPDATE history SET usercome = #{usercome} WHERE id IN(SELECT max(id) FROM history);")
    void updateLastHistoryUsercome(@Param("usercome") int newBalance);
}
