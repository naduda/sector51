package pr.sector51.server.web.socket;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.apache.tomcat.jdbc.pool.DataSource;
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

@Component
public class SocketHandler extends TextWebSocketHandler {
  private final List<WebSocketSession> sessions;
  private final NotificationListener listener;
  @Autowired
  private TokenHandler tokenHandler;
  @Autowired
  private UserDao userDao;
  @Autowired
  private DataSource dataSource;

  public SocketHandler() {
    super();
    sessions = new ArrayList<>();
    listener = new NotificationListener(sessions);
    listener.start();
  }

  @Override
  public void afterConnectionEstablished(WebSocketSession session) {
    System.out.println("Connection established");
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
      UserSecurity user = userDao.getUserSecurityById(userId.get()).get();
      if (user == null || expirationDate.get().getTime() < System.currentTimeMillis() ||
          (user.getAuthorities().size() > 0 && user.getAuthorities().contains(ERole.USER))) {
        session.close();
        return;
      }
      listener.setConnection(dataSource.getConnection());
      sessions.add(session);
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
  public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
    sessions.remove(session);
    System.out.println("Connection was CLOSED! " + sessions.size());
  }
}
