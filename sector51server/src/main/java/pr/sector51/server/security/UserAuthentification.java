package pr.sector51.server.security;

import java.util.Collection;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import pr.sector51.server.persistence.model.UserSecurity;

public class UserAuthentification implements Authentication {
  private final UserSecurity user;
  private boolean authentificated = true;

  public UserAuthentification(UserSecurity user) {
    this.user = user;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return user.getAuthorities();
  }

  @Override
  public Object getCredentials() {
    return user.getPassword();
  }

  @Override
  public Object getDetails() {
    return user;
  }

  @Override
  public Object getPrincipal() {
    return user;
  }

  @Override
  public boolean isAuthenticated() {
    return authentificated;
  }

  @Override
  public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
    authentificated = isAuthenticated;
  }

  @Override
  public String getName() {
    return user.getUsername();
  }
}
