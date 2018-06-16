package pr.sector51.server.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pr.sector51.server.persistence.BarcodeDao;
import pr.sector51.server.persistence.UserDao;
import pr.sector51.server.persistence.model.*;
import pr.sector51.server.web.socket.ScannerService;

import java.util.List;

@RequestMapping("api")
@RestController
public class RestBarcodeController extends RestCommon {
    private BarcodeDao barcode;
    private ScannerService scannerService;
    private UserDao userDao;

    @Autowired
    public RestBarcodeController(UserDao userDao, BarcodeDao barcode, ScannerService scannerService) {
        this.userDao = userDao;
        this.barcode = barcode;
        this.scannerService = scannerService;
    }

    // DELETE ==========================================================================
    @DeleteMapping("delete/productById/{id}")
    public ESector51Result removeProduct(@PathVariable("id") int id) {
        return barcode.removeProduct(id);
    }

    // GET =============================================================================
    @GetMapping("barcodeByCode/{code}")
    @ResponseBody
    public Barcode getBarcode(@PathVariable("code") String code, @RequestParam(value = "productId") String id) {
        int productId = Integer.parseInt(id);
        Barcode result = productId != UserDao.RESERVED_PRODUCTS_ID ?
                barcode.getBarcodeByProductId(productId) : barcode.getBarcodeByCode(code);
        return result != null ? result : new Barcode();
    }

    @GetMapping("products")
    @ResponseBody
    public List<Product> getAllProducts() {
        return barcode.getAllProducts();
    }

    // POST ============================================================================
    @PostMapping("scanner")
    public ESector51Result fromScanner(@RequestParam(value = "code") String code) {
        scannerService.next(code);
        return ESector51Result.OK;
    }

    @PostMapping("add/product")
    public Sector51Result addproduct(@RequestBody Product product, @RequestParam(value = "code") String code) {
        Sector51Result response = new Sector51Result(barcode.insertProduct(product, code));
        response.setMessage(barcode.getLastProduct());
        return response;
    }

    @PostMapping("add/userPay")
    public Sector51Result userPay(@RequestBody List<Object> body) {
        try {
            String userId = body.get(0).toString();
            String[] products = body.get(1).toString().split("_");
            int cash = (int) body.get(2);
            UserInfo user = userDao.getUserInfoByCard(userId);
            int oldBalance = user.getBalance();
            boolean success = barcode.runTransaction(() -> {
                user.setBalance(user.getBalance() + cash);
                for (String prod : products) {
                    if (prod.length() == 0) continue;
                    int prodId = Integer.parseInt(prod.split(":")[0]);
                    int count = Integer.parseInt(prod.split(":")[1]);
                    Product product = barcode.getPrpoductById(prodId).clone();
                    product.setCount(product.getCount() - count);
                    barcode.updateProduct(product);
                    user.setBalance(user.getBalance() - product.getPrice() * count);
                }
                int newBalance = user.getBalance() - oldBalance;
                userDao.updateLastHistoryUsercome(newBalance);
                userDao.updateUser(user);
            });
            return new Sector51Result(success ? ESector51Result.OK : ESector51Result.ERROR);
        } catch (Exception ex) {
            return new Sector51Result(ex.getMessage(), ESector51Result.ERROR);
        }
    }

    // PUT =============================================================================
    @PutMapping("update/product")
    public Sector51Result updateProduct(@RequestBody Product product) {
        Sector51Result response = new Sector51Result(ESector51Result.ERROR);
        try {
            response = new Sector51Result(barcode.updateProduct(product));
            response.setMessage(product);
        } catch (Exception ex) {
            response.setMessage(ex.getMessage());
        }
        return response;
    }
}
