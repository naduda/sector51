package pr.sector.server.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SelectItemDTO <T> {
  private T value;
  private String label;
  private boolean disabled;

  public SelectItemDTO(T pValue, String pLabel) {
    value = pValue;
    label = pLabel;
  }
}
