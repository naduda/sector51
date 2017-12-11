package pr.sector51.server.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pr.sector51.server.persistence.BarcodeDao;
import pr.sector51.server.persistence.model.*;
import pr.sector51.server.security.ERole;

import java.util.List;

@RequestMapping("/api")
@RestController
public class RestBarcodeController extends RestCommon {
  @Autowired
  private BarcodeDao barcode;

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
    Barcode result = productId > 10 ? barcode.getBarcodeByProductId(productId) : barcode.getBarcodeByCode(code);
    return result != null ? result : new Barcode();
  }

  @RequestMapping("/products")
  @ResponseBody
  public List<Product> getAllProducts() {
    return barcode.getAllProducts();
  }

  // POST ============================================================================
  @RequestMapping(value = "/add/product", method = RequestMethod.POST)
  public Sector51Result addproduct(@RequestBody Product product, @RequestParam(value="code") String code) {
    Sector51Result response = new Sector51Result(barcode.insertProduct(product, code));
    response.setMessage(barcode.getLastProduct());
    return response;
  }

  // POS =============================================================================
  @RequestMapping(value = "/update/product", method = RequestMethod.PUT)
  public Sector51Result updateProduct(@RequestBody Product product,
                                      @RequestParam(value="code") String code,
                                      @RequestParam(value="oldProductId") String oldProductId) {
    ESector51Result result = ESector51Result.ERROR;
    if (code.length() > 0 && oldProductId.length() > 0) {
      Barcode oldBarcode = barcode.getBarcodeByProductId(Integer.parseInt(oldProductId));
      oldBarcode.setCode(code);
      result = barcode.updateBarcode(oldBarcode);
    } else {
      result = barcode.updateProduct(product);
    }
    Sector51Result response = new Sector51Result(result);
    response.setMessage(product);
    return response;
  }
}
