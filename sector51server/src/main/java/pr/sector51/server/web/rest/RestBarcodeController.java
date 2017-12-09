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

  @RequestMapping("/barcode/{code}")
  @ResponseBody
  public Barcode getBarcode(@PathVariable("code") String code, @RequestParam(value="productId") String id) {
    int productId = Integer.parseInt(id);
    ERole mRole = GetCurrentUserRole();
    Barcode result = productId > 10 ? barcode.getBarcodeByProductId(productId) : barcode.getBarcodeByCode(code);
    return mRole.value <= ERole.ADMIN.value && result != null ? result : new Barcode();
  }

  @RequestMapping("/products")
  @ResponseBody
  public List<Product> getAllProducts() {
    ERole mRole = GetCurrentUserRole();
    List<Product> products = mRole.value <= ERole.ADMIN.value ? barcode.getAllProducts() : null;
    return products;
  }

  @RequestMapping(value = "/addproduct", method = RequestMethod.POST)
  public Sector51Result addproduct(@RequestBody Product product, @RequestParam(value="code") String code) {
    ERole mRole = GetCurrentUserRole();
    ESector51Result result = mRole.value <= ERole.ADMIN.value ?
        barcode.insertProduct(product, code) : ESector51Result.NOT_DENIED;
    Sector51Result response = new Sector51Result(result);
    response.setMessage(barcode.getLastProduct());
    return response;
  }

  @RequestMapping(value = "/updateProduct", method = RequestMethod.PUT)
  public Sector51Result updateProduct(@RequestBody Product product,
                                      @RequestParam(value="code") String code,
                                      @RequestParam(value="oldProductId") String oldProductId) {
    System.out.println("Update product");
    ERole mRole = GetCurrentUserRole();
    ESector51Result result = ESector51Result.NOT_DENIED;
    if (mRole.value <= ERole.ADMIN.value) {
      if (code.length() > 0 && oldProductId.length() > 0) {
        Barcode oldBarcode = barcode.getBarcodeByProductId(Integer.parseInt(oldProductId));
        oldBarcode.setCode(code);
        result = barcode.updateBarcode(oldBarcode);
      } else {
        result = barcode.updateProduct(product);
      }
    }
    Sector51Result response = new Sector51Result(result);
    response.setMessage(product);
    return response;
  }

  @RequestMapping(value = "/removeProduct/{id}", method = RequestMethod.DELETE)
  public ESector51Result removeProduct(@PathVariable("id") int id) {
    ERole mRole = GetCurrentUserRole();
    return mRole.value <= ERole.ADMIN.value ? barcode.removeProduct(id) : ESector51Result.NOT_DENIED;
  }
}
