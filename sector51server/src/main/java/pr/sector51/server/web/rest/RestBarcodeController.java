package pr.sector51.server.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pr.sector51.server.persistence.BarcodeDao;
import pr.sector51.server.persistence.UserDao;
import pr.sector51.server.persistence.model.*;
import pr.sector51.server.web.socket.ScannerService;

import java.util.List;

@RequestMapping("/api")
@RestController
public class RestBarcodeController extends RestCommon {
  @Autowired
  private BarcodeDao barcode;
  @Autowired
  private ScannerService scannerService;
  @Autowired
  private UserDao userDao;

  // DELETE ==========================================================================
  @RequestMapping(value = "/delete/productById/{id}", method = RequestMethod.DELETE)
  public ESector51Result removeProduct(@PathVariable("id") int id) {
    return barcode.removeProduct(id);
  }

  // GET =============================================================================
  @RequestMapping("/barcodeByCode/{code}")
  @ResponseBody
  public Barcode getBarcode(@PathVariable("code") String code, @RequestParam(value="productId") String id) {
    int productId = Integer.parseInt(id);
    Barcode result = productId != UserDao.RESERVED_PRODUCTS_ID ?
        barcode.getBarcodeByProductId(productId) : barcode.getBarcodeByCode(code);
    return result != null ? result : new Barcode();
  }

  @RequestMapping("/products")
  @ResponseBody
  public List<Product> getAllProducts() {
    return barcode.getAllProducts();
  }

  // POST ============================================================================
  @RequestMapping(value = "/scanner", method = RequestMethod.POST)
  public ESector51Result fromScanner(@RequestParam(value="code") String code) {
    scannerService.next(code);
    return ESector51Result.OK;
  }

  @RequestMapping(value = "/add/product", method = RequestMethod.POST)
  public Sector51Result addproduct(@RequestBody Product product, @RequestParam(value="code") String code) {
    Sector51Result response = new Sector51Result(barcode.insertProduct(product, code));
    response.setMessage(barcode.getLastProduct());
    return response;
  }

  @RequestMapping(value = "/add/userPay", method = RequestMethod.POST)
  public Sector51Result userPay(@RequestBody List<Object> body) {
    try {
      String userId = body.get(0).toString();
      String[] products = body.get(1).toString().split("_");
      int cash = (int)body.get(2);
      UserInfo user = userDao.getUserInfoByCard(userId);
      boolean success = barcode.runTransaction(() -> {
        user.setBalance(user.getBalance() + cash);
        for(String prod : products) {
          if (prod.length() == 0) continue;
          int prodId = Integer.parseInt(prod.split(":")[0]);
          int count = Integer.parseInt(prod.split(":")[1]);
          Product product = barcode.getPrpoductById(prodId);
          product.setCount(product.getCount() - count);
          barcode.updateProduct(product);
          user.setBalance(user.getBalance() - product.getPrice() * count);
        }
        userDao.updateUser(user);
      });
      return new Sector51Result(success ? ESector51Result.OK : ESector51Result.ERROR);
    } catch (Exception ex) {
      return new Sector51Result(ex.getMessage(), ESector51Result.ERROR);
    }
  }

  // PUT =============================================================================
  @RequestMapping(value = "/update/product", method = RequestMethod.PUT)
  public Sector51Result updateProduct(@RequestBody Product product) {
    ESector51Result result = barcode.updateProduct(product);
    Sector51Result response = new Sector51Result(result);
    response.setMessage(product);
    return response;
  }
}
