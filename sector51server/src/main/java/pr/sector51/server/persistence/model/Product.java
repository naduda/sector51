package pr.sector51.server.persistence.model;

public class Product {
  private int id;
  private String name;
  private String desc;
  private Integer count;
  private Integer price;
  private String code;

  public Product() {}

  public Product(int id, String name, String desc, Integer count, Integer price, String code) {
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.count = count;
    this.price = price;
    this.code = code;
  }

  @Override
  public Product clone() {
    return new Product(id, name, desc, count, price, code);
  }

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDesc() {
    return desc;
  }

  public void setDesc(String desc) {
    this.desc = desc;
  }

  public Integer getCount() {
    return count;
  }

  public void setCount(Integer count) {
    this.count = count;
  }

  public Integer getPrice() {
    return price;
  }

  public void setPrice(Integer price) {
    this.price = price;
  }

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }
}
