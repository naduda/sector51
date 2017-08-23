package pr.sector51.server.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pr.sector51.server.persistence.UserDao;
import pr.sector51.server.security.services.TokenHandler;

@CrossOrigin
@RequestMapping("/api")
public class ARestController {
  @Autowired
  protected UserDao userDao;
  @Autowired
  protected TokenHandler tokenHandler;
}
