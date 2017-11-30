package pr.sector51.server.persistence;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pr.sector51.server.persistence.mappers.IScannerMapper;
import pr.sector51.server.persistence.model.Barcode;
import pr.sector51.server.persistence.model.Product;

import java.util.List;

@Service
public class BarcodeDao {
  @Autowired
  private IScannerMapper scanner;

  public Barcode getBarcodeByCode(String code) {
    return scanner.getBarcodeByCode(code);
  }

  public List<Product> getAllProducts() {
    return scanner.getAllProducts();
  }
}
