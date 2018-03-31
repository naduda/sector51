package pr.sector51.server.security;

import org.springframework.security.core.GrantedAuthority;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public enum ERole implements GrantedAuthority {
  OWNER(0), ADMIN(10), USER(100), SELDER(125), TRAINER(150), SCANNER(200);

  public final int value;
  ERole(int value) {
    this.value = value;
  }

  @Override
  public String getAuthority() {
    return name();
  }

  public static String getHierarchy() {
    List<String> res = new ArrayList<>();
    for (ERole authority : ERole.values()) {
      res.add(authority.getAuthority());
    }
    return res.stream().collect(Collectors.joining(" > "));
  }
}
