package pr.sector51.server.web.socket;

import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.ArrayList;
import java.util.List;

@Service
public class ScannerService {
  public final List<WebSocketSession> sessions;
  public final List<WebSocketSession> closedSessions;

  public ScannerService() {
    sessions = new ArrayList<>();
    closedSessions = new ArrayList<>();
  }

  public void subscribe(WebSocketSession session) {
    sessions.add(session);
  }

  public void unsubscribe(WebSocketSession session) {
    sessions.remove(session);
  }

  public List<WebSocketSession> subscribers() {
    return sessions;
  }

  public void next(String message) {
    sessions.forEach(s -> {
      if (s.isOpen()) {
        try {
          s.sendMessage(new TextMessage(String.format("{ \"code\": \"%s\" }", message)));
        } catch (Exception e) {
          e.printStackTrace();
        }
      } else {
        closedSessions.add(s);
      }
    });
    if (closedSessions.size() > 0) {
      closedSessions.forEach(s -> sessions.remove(s));
      closedSessions.clear();
    }
  }
}
