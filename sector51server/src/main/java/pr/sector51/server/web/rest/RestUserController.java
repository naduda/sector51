package pr.sector51.server.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pr.sector51.server.mail.SmtpMailSender;
import pr.sector51.server.persistence.UserDao;
import pr.sector51.server.persistence.model.KeyValuePair;
import pr.sector51.server.persistence.model.MailLetter;
import pr.sector51.server.persistence.model.UserInfo;
import pr.sector51.server.persistence.model.UserSecurity;
import pr.sector51.server.security.ERole;
import pr.sector51.server.security.services.TokenHandler;

import javax.mail.MessagingException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RequestMapping("api")
@RestController
public class RestUserController extends RestCommon {
    private UserDao userDao;
    private TokenHandler tokenHandler;
    private SmtpMailSender mailSender;

    @Autowired
    public RestUserController(UserDao userDao, TokenHandler tokenHandler, SmtpMailSender mailSender) {
        this.userDao = userDao;
        this.tokenHandler = tokenHandler;
        this.mailSender = mailSender;
    }

    // DELETE ===========================================================================
    @DeleteMapping("delete/userById/{created}")
    public ResponseEntity<String> removeUser(@PathVariable("created") long created) {
        boolean success = userDao.deleteUser(new Timestamp(created)) == 1;
        return ResponseEntity.ok("User was" + (success ? "" : "n't") + "deleted.");
    }

    // GET ==============================================================================
    @GetMapping("profileByName/{name}")
    public UserInfo profile(@PathVariable("name") String login) {
        UserInfo userInfo = getUserInfoByLogin(login);
        return userDao.getUserInfoById(userInfo.getCreated());
    }

    @GetMapping("public/roles")
    public List<KeyValuePair> getRoles() {
        return Arrays.stream(ERole.values()).filter(r -> r != ERole.SCANNER)
                .map(r -> new KeyValuePair(r.value, r.name())).collect(Collectors.toList());
    }

    @GetMapping("userByCard/{card}")
    public UserInfo getUserByCard(@PathVariable("card") String card) {
        return userDao.getUserInfoByCard(card);
    }

    @GetMapping("userById/{id}")
    public UserInfo getUserById(@PathVariable("id") long id) {
        Timestamp created = new Timestamp(id);
        return userDao.getUserInfoById(created);
    }

    @GetMapping("users")
    public List<UserInfo> getUsers() {
        return userDao.getUsersInfo();
    }

    @GetMapping("public/usersNotExist")
    public boolean usersNotExist() {
        return userDao.getUsersCount() == 0;
    }

    // POST =============================================================================
    @PostMapping("public/login")
    public String getToken(@RequestBody UserSecurity user) {
        String token = "";
        UserInfo userInfo = getUserInfoByLogin(user.getUsername());
        if (userInfo == null) {
            return String.format("{\"token\": \"%s\"}", token);
        }

        UserSecurity dbUser = userDao.getUserSecurityById(userInfo.getCreated());
        if (dbUser != null && UserDao.encoder.matches(user.getPassword(), dbUser.getPassword())) {
            token = tokenHandler.generateToken(dbUser.getCreated().getTime(), LocalDateTime.now().plusDays(1));
        }
        return String.format("{\"token\": \"%s\"}", token);
    }

    @PostMapping("add/user")
    public ResponseEntity<UserInfo> createUser(@RequestBody UserInfo user) {
        return ResponseEntity.ok(userDao.insertUser(user));
    }

    @PostMapping("public/add/firstUser")
    public ResponseEntity<UserInfo> createFirstUser(@RequestBody UserInfo user) {
        if (usersNotExist()) {
            throw new IllegalStateException();
        }
        return ResponseEntity.ok(userDao.insertUser(user));
    }

    @PostMapping("sendemail")
    public ResponseEntity<MailLetter> sendEmail(@RequestBody MailLetter letter) throws MessagingException {
        mailSender.send(letter.getRecipient(), letter.getTitle(), letter.getBody());
        return ResponseEntity.ok(letter);
    }

    // PUT =============================================================================
    @PutMapping("update/user")
    public ResponseEntity<String> updateUser(@RequestBody UserInfo user) {
        return ResponseEntity.ok("User was" + (userDao.updateUser(user) ? "" : "n't") + " updated.");
    }
}
