package pr.sector51.server.persistence.mappers;

import java.util.Map;

public class UpdateProvider {
    public static String getQuery(Map<String, Object> params) {
        return params.get("query").toString();
    }
}
