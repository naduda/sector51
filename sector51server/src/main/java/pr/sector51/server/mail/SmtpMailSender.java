package pr.sector51.server.mail;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class SmtpMailSender {
  @Autowired
  private JavaMailSender javaMailSender;

  public void send(String recipient, String title, String body) throws MessagingException {
    MimeMessage message = javaMailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message, true);
    helper.setSubject(title);
    helper.setTo(recipient);
    helper.setText(body, true);
    javaMailSender.send(message);
  }
}
