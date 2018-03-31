package pr.sector51.server.persistence;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pr.sector51.server.persistence.mappers.IScannerMapper;
import pr.sector51.server.persistence.model.*;

import java.sql.Timestamp;
import java.util.List;

@Service
public class BarcodeDao extends CommonDao {
  @Autowired
  private IScannerMapper scanner;

  public Barcode getBarcodeByCode(String code) {
    return scanner.getBarcodeByCode(code);
  }

  public Barcode getBarcodeByProductId(int id) {
    return scanner.getBarcodeByProductId(id);
  }

  public List<Product> getAllProducts() {
    return scanner.getAllProducts();
  }

  public ESector51Result insertProduct(Product product, String code) {
    return code.equals("-1") ?
        scanner.insertProductDefault(product) == 1 ? ESector51Result.OK : ESector51Result.ERROR :
        scanner.insertProduct(product, code) == 1 ? ESector51Result.OK : ESector51Result.ERROR;
  }

  public ESector51Result updateProduct(Product product, Timestamp idUser) {
    boolean trResult = runTransaction(() -> {
      Product oldProduct = scanner.getPrpoductById(product.getId());
      int count = product.getCount() - oldProduct.getCount();
      scanner.updateProduct(product);
      if (count != 0) {
        History history = new History(count > 0 ? 4 : 5, idUser, product.getId() + "_" + Math.abs(count));
        insert2history(history);
      }
    });
    return trResult ? ESector51Result.OK : ESector51Result.ERROR;
  }

  public ESector51Result removeProduct(int id) {
    return scanner.removeProduct(id) == 1 ? ESector51Result.OK : ESector51Result.ERROR;
  }

  public Product getLastProduct() {
    return scanner.getLastProduct();
  }

  public ESector51Result updateBarcode(Barcode barcode) {
    return scanner.updateBarcode(barcode) == 1 ? ESector51Result.OK : ESector51Result.ERROR;
  }

  public Product getPrpoductById(int prodId) {
    return scanner.getPrpoductById(prodId);
  }
}
