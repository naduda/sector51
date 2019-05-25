//package pr.sector.server.security;
//
//import com.fasterxml.jackson.annotation.JsonIgnore;
//import lombok.EqualsAndHashCode;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//import pr.sector.server.model.User;
//
//import java.util.Collection;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Getter
//@EqualsAndHashCode
//public class UserPrincipal implements UserDetails {
//    private Long id;
//    private String name;
//    private String username;
//    private Collection<? extends GrantedAuthority> authorities;
//
//    @JsonIgnore
//    private String password;
//    @JsonIgnore
//    private String email;
//
//    UserPrincipal(Long id, String name, String username, String email, String password, Collection<? extends GrantedAuthority> authorities) {
//        this.id = id;
//        this.name = name;
//        this.username = username;
//        this.email = email;
//        this.password = password;
//        this.authorities = authorities;
//    }
//
//    static UserPrincipal create(User user) {
//        List<GrantedAuthority> authorities = user.getRoles().stream().map(role ->
//                new SimpleGrantedAuthority(role.getName().name())
//        ).collect(Collectors.toList());
//
//        return new UserPrincipal(
//                user.getId(),
//                user.getName(),
//                user.getUsername(),
//                user.getEmail(),
//                user.getPassword(),
//                authorities
//        );
//    }
//
//    @Override
//    public boolean isAccountNonExpired() {
//        return true;
//    }
//
//    @Override
//    public boolean isAccountNonLocked() {
//        return true;
//    }
//
//    @Override
//    public boolean isCredentialsNonExpired() {
//        return true;
//    }
//
//    @Override
//    public boolean isEnabled() {
//        return true;
//    }
//}
