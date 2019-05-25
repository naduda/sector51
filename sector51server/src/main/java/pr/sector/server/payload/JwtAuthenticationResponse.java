package pr.sector.server.payload;

import lombok.Data;

@Data
public class JwtAuthenticationResponse extends Response {
    private String accessToken;
    private String tokenType = "Bearer";

    public JwtAuthenticationResponse(String accessToken) {
        this.accessToken = accessToken;
    }
}
