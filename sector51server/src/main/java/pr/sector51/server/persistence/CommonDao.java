package pr.sector51.server.persistence;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;
import pr.sector51.server.mail.SmtpMailSender;
import pr.sector51.server.persistence.mappers.ICommonMapper;
import pr.sector51.server.persistence.mappers.IThingsMapper;
import pr.sector51.server.persistence.mappers.IUserMapper;
import pr.sector51.server.persistence.model.Event;
import pr.sector51.server.persistence.model.History;
import pr.sector51.server.persistence.model.UserInfo;

import javax.mail.MessagingException;
import java.sql.Timestamp;

public class CommonDao {
  @Autowired
  private ICommonMapper commonMapper;
  @Autowired
  private DataSourceTransactionManager transactionManager;
  @Autowired
  protected IThingsMapper thingsMapper;
  @Autowired
  private SmtpMailSender mailSender;

  public boolean runTransaction(Runnable method) {
    DefaultTransactionDefinition def = new DefaultTransactionDefinition();
    def.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);

    TransactionStatus status = transactionManager.getTransaction(def);
    try {
      method.run();
      transactionManager.commit(status);
      return true;
    } catch (Exception ex) {
      System.out.println(ex);
      transactionManager.rollback(status);
      return false;
    }
  }

  public UserInfo getUserInfoById(Timestamp value) {
    return commonMapper.getUserInfoById(value);
  }

  public boolean isTableExist(String name) {
    return commonMapper.isTableExist(name);
  }

  public void insertEvent(Event event) {
    commonMapper.insertEvent(event);
  }

  public void updateLastHistoryUsercome(int newBalance) {
    commonMapper.updateLastHistoryUsercome(newBalance);
  }
}
