package pr.sector51.server.persistence.model;

public class Barcode {
  private int productId;
  private String code;

  public Barcode() {}

  public int getProductId() {
    return productId;
  }

  public void setProductId(int productId) {
    this.productId = productId;
  }

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }
}
