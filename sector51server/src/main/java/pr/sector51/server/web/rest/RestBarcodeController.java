package pr.sector51.server.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pr.sector51.server.persistence.BarcodeDao;
import pr.sector51.server.persistence.UserDao;
import pr.sector51.server.persistence.model.Barcode;
import pr.sector51.server.persistence.model.Product;
import pr.sector51.server.persistence.model.UserInfo;
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
    public ResponseEntity<String> removeProduct(@PathVariable("id") int id) {
        return ResponseEntity.ok("Product was" + (barcode.removeProduct(id) ? "" : "n't") + " deleted.");
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
    public ResponseEntity<String> fromScanner(@RequestParam(value = "code") String code) {
        scannerService.next(code);
        return ResponseEntity.ok(null);
    }

    @PostMapping("add/product")
    public ResponseEntity<Product> addproduct(@RequestBody Product product, @RequestParam(value = "code") String code) {
        barcode.insertProduct(product, code);
        return ResponseEntity.ok(barcode.getLastProduct());
    }

    @PostMapping("add/userPay")
    public ResponseEntity<String> userPay(@RequestBody List<Object> body) {
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
        if (!success) {
            throw new RuntimeException("Something went wrong.");
        }
        return ResponseEntity.ok(null);
    }

    // PUT =============================================================================
    @PutMapping("update/product")
    public ResponseEntity<String> updateProduct(@RequestBody Product product) {
        return ResponseEntity.ok("Product was" + (barcode.updateProduct(product) ? "" : "n't") + " updated.");
    }
}
