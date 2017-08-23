package pr.sector51.server.security.services;

import com.google.common.io.BaseEncoding;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.Optional;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.stereotype.Component;

@Component
public class TokenHandler {
  private final SecretKey secretKey;

  public TokenHandler() {
    String jwtKey = "jwtKey1234567890qwe";
    byte[] decodedKey = BaseEncoding.base64().decode(jwtKey);
    secretKey = new SecretKeySpec(decodedKey, 0, decodedKey.length, "AES");
  }

  public Optional<String> extractUserId(String token) {
    try {
      Jws<Claims> claimsJws = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
      Claims body = claimsJws.getBody();
      return Optional.ofNullable(body.getId());
    } catch (RuntimeException ex) {
      return Optional.empty();
    }
  }

  public Optional<Date> extractExpirationDate(String token) {
    try {
      Jws<Claims> claimsJws = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
      Claims body = claimsJws.getBody();
      return Optional.ofNullable(body.getExpiration());
    } catch (RuntimeException ex) {
      return Optional.empty();
    }
  }

  public String generateToken(long userId, LocalDateTime localDateTime) {
    return Jwts.builder()
        .setId(String.valueOf(userId))
        .setExpiration(Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant()))
        .signWith(SignatureAlgorithm.HS512, secretKey)
        .compact();
  }
}
