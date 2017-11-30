package pr.sector51.server.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import pr.sector51.server.persistence.BarcodeDao;
import pr.sector51.server.persistence.model.Barcode;
import pr.sector51.server.persistence.model.Product;

import java.util.List;

@RequestMapping("/api")
@RestController
public class RestBarcodeController {
  @Autowired
  private BarcodeDao barcode;

  @RequestMapping("/barcode/{code}")
  @ResponseBody
  public Barcode getBarcodeByCode(@PathVariable("code") String code) {
    return barcode.getBarcodeByCode(code);
  }

  @RequestMapping("/products")
  @ResponseBody
  public List<Product> getAllProducts() {
    return barcode.getAllProducts();
  }
}
