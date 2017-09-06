package pr.sector51.server.security.services;

import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import pr.sector51.server.persistence.UserDao;
import pr.sector51.server.security.UserAuthentification;

@Service
public class TokenAuthService {
  public static final String AUTH_HEADER_NAME = "X-Auth-Token";
  @Autowired
  private UserDao userDao;
  @Autowired
  private TokenHandler tokenHandler;

  public Optional<Authentication> getAuthentification(HttpServletRequest request) {
    Optional<Authentication> authentication = Optional
        .ofNullable(request.getHeader(AUTH_HEADER_NAME))
        .flatMap(tokenHandler::extractUserId)
        .flatMap(userDao::getUserSecurityById)
        .map(UserAuthentification::new);
    return authentication;
  }
}
