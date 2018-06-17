package pr.sector51.server.persistence;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.stereotype.Service;
import pr.sector51.server.persistence.mappers.ICommonMapper;
import pr.sector51.server.persistence.mappers.IScannerMapper;
import pr.sector51.server.persistence.mappers.IThingsMapper;
import pr.sector51.server.persistence.model.Barcode;
import pr.sector51.server.persistence.model.Product;

import java.util.List;

@Service
public class BarcodeDao extends CommonDao {
    private IScannerMapper scanner;

    @Autowired
    public BarcodeDao(ICommonMapper commonMapper, DataSourceTransactionManager transactionManager,
                      IThingsMapper thingsMapper, IScannerMapper scanner) {
        super(commonMapper, transactionManager, thingsMapper);
        this.scanner = scanner;
    }

    public Barcode getBarcodeByCode(String code) {
        return scanner.getBarcodeByCode(code);
    }

    public Barcode getBarcodeByProductId(int id) {
        return scanner.getBarcodeByProductId(id);
    }

    public List<Product> getAllProducts() {
        return scanner.getAllProducts();
    }

    public boolean insertProduct(Product product, String code) {
        return code.equals("-1") ? scanner.insertProductDefault(product) == 1 : scanner.insertProduct(product, code) == 1;
    }

    public boolean updateProduct(Product product) {
        return scanner.updateProduct(product) == 1;
    }

    public boolean removeProduct(int id) {
        return scanner.removeProduct(id) == 1;
    }

    public Product getLastProduct() {
        return scanner.getLastProduct();
    }

    public Product getPrpoductById(int prodId) {
        return scanner.getPrpoductById(prodId);
    }
}
