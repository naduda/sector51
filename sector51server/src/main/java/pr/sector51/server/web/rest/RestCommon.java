package pr.sector51.server.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import pr.sector51.server.persistence.UserDao;
import pr.sector51.server.persistence.model.UserInfo;

import java.util.List;

class RestCommon {
  @Autowired
  protected UserDao userDao;

  UserInfo getUserInfoByLogin(String login) {
    List<UserInfo> users = null;
    if (login.contains("@")) {
      users = userDao.getUserInfoByEmail(login.replaceAll(",", "."));
    } else if (login.length() > 9) {
      users = userDao.getUserInfoByPnone(login);
    }
    return users == null || users.size() < 1 ? null : users.get(0);
  }
}
