package pr.sector.server.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserDTO {
  private long card;
  private long birthday;
  private boolean gender;
  private String name;
  private String phone;
  private String password;
  private String role;
  private String surname;
}
