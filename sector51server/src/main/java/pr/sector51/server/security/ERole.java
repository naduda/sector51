package pr.sector51.server.security;

import org.springframework.security.core.GrantedAuthority;

public enum ERole implements GrantedAuthority {
  OWNER(0), ADMIN(10), USER(100);

  public final int value;
  ERole(int value) {
    this.value = value;
  }

  @Override
  public String getAuthority() {
    return name();
  }
}
