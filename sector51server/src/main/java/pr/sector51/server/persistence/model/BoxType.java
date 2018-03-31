package pr.sector51.server.persistence.model;

public class BoxType {
  private int id;
  private String name;

  public BoxType() {}

  public BoxType(int id, String desc) {
    this.id = id;
    this.name = desc;
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
}
