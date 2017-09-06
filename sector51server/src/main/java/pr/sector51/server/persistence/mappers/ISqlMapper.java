package pr.sector51.server.persistence.mappers;

import java.util.List;
import org.apache.ibatis.annotations.SelectProvider;

public interface ISqlMapper {
    class PureSqlProvider {
        public String sql(String sql) {
            return sql;
        }
    }

    @SelectProvider(type = PureSqlProvider.class, method = "sql")
    List<Object> select(String sql);

    @SelectProvider(type = PureSqlProvider.class, method = "sql")
    Integer execute(String query);
}
