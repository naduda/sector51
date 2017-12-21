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
    Barcode result = productId > UserDao.RESERVED_PRODUCTS_ID ?
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

  // PUT =============================================================================
  @RequestMapping(value = "/update/product", method = RequestMethod.PUT)
  public Sector51Result updateProduct(@RequestBody Product product,
                                      @RequestParam(value="oldProductId") String oldProductId) {
    ESector51Result result = ESector51Result.ERROR;
    if (oldProductId.length() > 0 && !oldProductId.equals(String.valueOf(product.getId()))) {
      Barcode oldBarcode = barcode.getBarcodeByProductId(Integer.parseInt(oldProductId));
      oldBarcode.setCode(product.getCode());
      result = barcode.updateBarcode(oldBarcode);
    } else {
      result = barcode.updateProduct(product);
    }
    Sector51Result response = new Sector51Result(result);
    response.setMessage(product);
    return response;
  }
}
