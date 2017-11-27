package pr.sector51.server.web.socket;

import org.postgresql.PGConnection;
import org.postgresql.PGNotification;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

class NotificationListener extends Thread
{
  private PGConnection pgconn;
  private List<WebSocketSession> sessions;

  NotificationListener(List<WebSocketSession> sessions)
  {
    this.sessions = sessions;
  }

  public void setConnection(Connection connection) {
    try (Statement stmt = connection.createStatement()) {
      this.pgconn = connection.unwrap(PGConnection.class);
      stmt.execute("LISTEN scanner_update");
      stmt.close();
    } catch (SQLException e) {
      e.printStackTrace();
    }
  }

  public void run() {
    while (true) {
      try {
        while (pgconn == null) {
          Thread.sleep(100);
        }
        PGNotification notifications[] = pgconn.getNotifications();

        if (notifications != null) {
          for (int i = 0; i < notifications.length; i++) {
            System.out.println("Got notification para: " + notifications[i].getParameter());
            sendMessage(notifications[i].getParameter());
          }
        }

        Thread.sleep(500);
      } catch (SQLException | InterruptedException ex) {
        ex.printStackTrace();
      }
    }
  }

  private void sendMessage(String message) {
    sessions.forEach(s -> {
      if (s.isOpen()) {
        try {
          s.sendMessage(new TextMessage(message));
        } catch (Exception e) {
          e.printStackTrace();
        }
      } else {
        sessions.remove(s);
      }
    });
  }
}
