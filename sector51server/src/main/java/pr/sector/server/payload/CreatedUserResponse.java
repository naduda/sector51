package pr.sector.server.payload;

import lombok.Data;

@Data
public class CreatedUserResponse extends ApiResponse {
    private long userId;

    public CreatedUserResponse(Boolean success, String message, long userId) {
        super(success, message);
        this.userId = userId;
    }
}
