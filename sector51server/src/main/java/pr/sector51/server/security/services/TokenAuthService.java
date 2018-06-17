package pr.sector51.server.security.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import pr.sector51.server.persistence.UserDao;
import pr.sector51.server.security.UserAuthentification;

import javax.servlet.http.HttpServletRequest;
import java.util.Optional;

@Service
public class TokenAuthService {
    private static final String AUTH_HEADER_NAME = "X-Auth-Token";
    private UserDao userDao;
    private TokenHandler tokenHandler;

    @Autowired
    public TokenAuthService(UserDao userDao, TokenHandler tokenHandler) {
        this.userDao = userDao;
        this.tokenHandler = tokenHandler;
    }

    public Optional<Authentication> getAuthentification(HttpServletRequest request) {
        return Optional
                .ofNullable(request.getHeader(AUTH_HEADER_NAME))
                .flatMap(tokenHandler::extractUserId)
                .flatMap(userDao::getUserSecurityById)
                .map(UserAuthentification::new);
    }
}
