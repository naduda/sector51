package pr.sector51.server.persistence;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;
import pr.sector51.server.persistence.mappers.ICommonMapper;
import pr.sector51.server.persistence.mappers.IThingsMapper;
import pr.sector51.server.persistence.model.UserInfo;

import java.sql.Timestamp;
import java.util.Map;

public class CommonDao {
    private ICommonMapper commonMapper;
    private DataSourceTransactionManager transactionManager;
    IThingsMapper thingsMapper;

    @Autowired
    public CommonDao(ICommonMapper commonMapper, DataSourceTransactionManager transactionManager,
                     IThingsMapper thingsMapper) {
        this.commonMapper = commonMapper;
        this.transactionManager = transactionManager;
        this.thingsMapper = thingsMapper;
    }

    public void update(String query) {
        commonMapper.update(query);
    }

    public boolean runTransaction(Runnable method) {
        DefaultTransactionDefinition def = new DefaultTransactionDefinition();
        def.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);

        TransactionStatus status = transactionManager.getTransaction(def);
        try {
            method.run();
            transactionManager.commit(status);
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
            transactionManager.rollback(status);
            return false;
        }
    }

    public UserInfo getUserInfoById(Timestamp value) {
        return commonMapper.getUserInfoById(value);
    }

    public void updateLastHistoryUsercome(int newBalance) {
        commonMapper.updateLastHistoryUsercome(newBalance);
    }
}
