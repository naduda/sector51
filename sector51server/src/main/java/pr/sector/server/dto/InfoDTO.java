package pr.sector.server.dto;

import lombok.Data;

@Data
public class InfoDTO {
  private final String name;
  private final String version;

  public InfoDTO() {
    this.name = "sector-server";
    this.version = "0.0.1";
  }
}
