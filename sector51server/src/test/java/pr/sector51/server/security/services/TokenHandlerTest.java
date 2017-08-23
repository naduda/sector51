package pr.sector51.server.security.services;

import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.Test;

public class TokenHandlerTest {
  @Test
  public void generateToken() {
    TokenHandler tokenHandler = new TokenHandler();
    String token = tokenHandler.generateToken(110488, LocalDateTime.now().plusDays(14));
    System.out.println(token);

    Optional<String> id = tokenHandler.extractUserId(token);
    System.out.println(id.get().toString());
    System.out.println("****************\n\n\n\n\n\n\n*********************");
  }
}
