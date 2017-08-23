package pr.sector51.server.persistence.model;

import java.sql.Timestamp;

public class UserSecurityBuilder {

  private String username;
  private String password;
  private String roles;
  private boolean accountNonExpired;
  private boolean accountNonLocked;
  private boolean credentialsNonExpired;
  private boolean enabled;
  private int attempts;
  private Timestamp lastmodified;
  private Timestamp created;

  public UserSecurityBuilder() {
    username = "admin";
    password = "qwe";
    roles = "OWNER";
    accountNonExpired = true;
    accountNonLocked = true;
    credentialsNonExpired = true;
    enabled = true;
    created = new Timestamp(System.currentTimeMillis());
  }

  public UserSecurityBuilder setUsername(String username) {
    this.username = username;
    return this;
  }

  public UserSecurityBuilder setPassword(String password) {
    this.password = password;
    return this;
  }

  public UserSecurityBuilder setRoles(String roles) {
    this.roles = roles;
    return this;
  }

  public UserSecurityBuilder setAccountNonExpired(boolean accountNonExpired) {
    this.accountNonExpired = accountNonExpired;
    return this;
  }

  public UserSecurityBuilder setAccountNonLocked(boolean accountNonLocked) {
    this.accountNonLocked = accountNonLocked;
    return this;
  }

  public UserSecurityBuilder setCredentialsNonExpired(boolean credentialsNonExpired) {
    this.credentialsNonExpired = credentialsNonExpired;
    return this;
  }

  public UserSecurityBuilder setEnabled(boolean enabled) {
    this.enabled = enabled;
    return this;
  }

  public UserSecurityBuilder setAttempts(int attempts) {
    this.attempts = attempts;
    return this;
  }

  public UserSecurityBuilder setLastmodified(Timestamp lastmodified) {
    this.lastmodified = lastmodified;
    return this;
  }

  public UserSecurityBuilder setCreated(Timestamp created) {
    this.created = created;
    return this;
  }

  public UserSecurity build() {
    return new UserSecurity(username, password, roles, accountNonExpired, accountNonLocked,
        credentialsNonExpired, enabled, attempts, lastmodified, created);
  }
}