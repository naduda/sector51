package pr.sector51.server.persistence;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;
import pr.sector51.server.persistence.mappers.ICommonMapper;

public class CommonDao implements ICommonMapper {
  @Autowired
  private ICommonMapper commonMapper;
  @Autowired
  private DataSourceTransactionManager transactionManager;

  public boolean runTransaction(ICommonDao method) {
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

  @Override
  public boolean isTableExist(String name) {
    return commonMapper.isTableExist(name);
  }

  @Override
  public void createTableHistory() {
    commonMapper.createTableHistory();
  }

  @Override
  public void createTableEvents() {
    commonMapper.createTableEvents();
  }
}
