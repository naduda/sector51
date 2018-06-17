package pr.sector51.server.web.socket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import pr.sector51.server.persistence.UserDao;
import pr.sector51.server.persistence.model.UserSecurity;
import pr.sector51.server.security.ERole;
import pr.sector51.server.security.services.TokenHandler;

import java.io.IOException;
import java.util.Date;
import java.util.Optional;

@Component
public class SocketHandler extends TextWebSocketHandler {
    private TokenHandler tokenHandler;
    private UserDao userDao;
    private ScannerService scannerService;

    public SocketHandler() {
        super();
    }

    @Autowired
    public SocketHandler(TokenHandler tokenHandler, UserDao userDao, ScannerService scannerService) {
        this();
        this.tokenHandler = tokenHandler;
        this.userDao = userDao;
        this.scannerService = scannerService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String token = session.getUri().getQuery();
        if (token != null) {
            token = token.substring(token.indexOf("=") + 1);
        }
        try {
            Optional<Date> expirationDate = tokenHandler.extractExpirationDate(token);
            Optional<String> userId = tokenHandler.extractUserId(token);
            if (!expirationDate.isPresent() || !userId.isPresent()) {
                session.close();
                return;
            }
            Optional<UserSecurity> user = userDao.getUserSecurityById(userId.get());
            if (!user.isPresent() || expirationDate.get().getTime() < System.currentTimeMillis() ||
                    (user.get().getAuthorities().size() > 0 && user.get().getAuthorities().contains(ERole.USER))) {
                session.close();
                return;
            }
            scannerService.subscribe(session);
        } catch (Exception ex) {
            try {
                session.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        if ("CLOSE".equalsIgnoreCase(message.getPayload())) {
            session.close();
        } else {
            System.out.println("Received:" + message.getPayload());
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        scannerService.unsubscribe(session);
    }
}
