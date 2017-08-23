package pr.sector51.server.security;

import org.springframework.security.core.GrantedAuthority;

public enum ERole implements GrantedAuthority {
  OWNER, ADMIN, USER;

  @Override
  public String getAuthority() {
    return name();
  }
}
