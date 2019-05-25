package pr.sector.server.payload;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiResponse extends Response {
    private Boolean success;
    private String message;
}
