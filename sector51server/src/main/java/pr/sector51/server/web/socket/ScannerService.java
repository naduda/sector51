package pr.sector51.server.web.socket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import pr.sector51.server.persistence.BarcodeDao;
import pr.sector51.server.persistence.ThingsDao;
import pr.sector51.server.persistence.UserDao;
import pr.sector51.server.persistence.model.Barcode;
import pr.sector51.server.persistence.model.Product;
import pr.sector51.server.persistence.model.UserInfo;
import pr.sector51.server.persistence.model.UserServise51;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScannerService {
  public final List<WebSocketSession> sessions;
  public final List<WebSocketSession> closedSessions;
  @Autowired
  private UserDao userDao;
  @Autowired
  private ThingsDao thingsDao;
  @Autowired
  private BarcodeDao barcodeDao;

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
          UserInfo user = userDao.getUserInfoByCard(message);
          Barcode barcode = barcodeDao.getBarcodeByCode(message);
          if (user.getPhone() != null) {
            long curTime = System.currentTimeMillis();
            UserServise51 service = thingsDao.getUserServices(user.getCreated()).stream()
                    .filter(us -> us.getIdService() != 1 && us.getIdService() != 2)
                    .filter(us -> us.getDtBeg().getTime() <= curTime && curTime < us.getDtEnd().getTime())
                    .findFirst().orElse(null);

            s.sendMessage(new TextMessage(String.format("{\"user\": %s, \"service\": %s}",
                    user.toString(), service != null ? service.toString() : null)));
          } else if (barcode != null) {
            Product product = barcodeDao.getPrpoductById(barcode.getProductId());
            s.sendMessage(new TextMessage(String.format("{\"product\": %s}",
                    product != null ? product.toString() : null)));
          } else {
            s.sendMessage(new TextMessage(String.format("{\"barcode\": %s}", message)));
          }
        } catch (Exception e) {
          e.printStackTrace();
        }
      } else {
        closedSessions.add(s);
      }
    });
    if (closedSessions.size() > 0) {
      closedSessions.forEach(sessions::remove);
      closedSessions.clear();
    }
  }
}
