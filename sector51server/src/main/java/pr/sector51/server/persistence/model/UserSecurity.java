package pr.sector51.server.persistence.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import pr.sector51.server.security.ERole;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class UserSecurity implements UserDetails {
    private String username;
    private String password;
    protected List<ERole> authorities;
    private boolean accountNonExpired;
    private boolean accountNonLocked;
    private boolean credentialsNonExpired;
    private boolean enabled;
    private int attempts;
    private Timestamp lastmodified;
    private String roles;
    private Timestamp created;

    public UserSecurity() {
    }

    public UserSecurity(String username, String password, String roles, boolean accountNonExpired,
                        boolean accountNonLocked, boolean credentialsNonExpired, boolean enabled,
                        int attempts, Timestamp lastmodified, Timestamp created) {

        this();

        this.username = username;
        this.password = password;
        setRoles(roles);
        this.accountNonExpired = accountNonExpired;
        this.accountNonLocked = accountNonLocked;
        this.credentialsNonExpired = credentialsNonExpired;
        this.enabled = enabled;
        this.attempts = attempts;
        this.lastmodified = lastmodified;
        this.created = created;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return accountNonExpired;
    }

    @Override
    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return credentialsNonExpired;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    public String getRoles() {
        if (authorities == null) {
            return "";
        }
        return authorities.stream().map(a -> a.getAuthority()).collect(Collectors.joining(","));
    }

    public void setRoles(String roles) {
        this.roles = roles;
        authorities = new ArrayList<>();
        if (roles != null) {
            for (String r : roles.split(",")) {
                if (r != null && r.length() > 0) {
                    authorities.add(ERole.valueOf(r));
                }
            }
        }
    }

    public ERole getRole() {
        return authorities.get(0);
    }

    public Timestamp getCreated() {
        return created;
    }
}
