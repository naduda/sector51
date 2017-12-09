package pr.sector51.server.web.rest;

import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import pr.sector51.server.persistence.model.UserSecurity;
import pr.sector51.server.security.ERole;

import java.util.List;

class RestCommon {
  protected List<ERole> getPermissionsByContext() {
    SecurityContext context = SecurityContextHolder.getContext();
    UserSecurity userSecurity = (UserSecurity) context.getAuthentication().getPrincipal();
    return (List<ERole>) userSecurity.getAuthorities();
  }

  protected ERole GetCurrentUserRole() {
    SecurityContext context = SecurityContextHolder.getContext();
    UserSecurity userSecurity = (UserSecurity) context.getAuthentication().getPrincipal();
    List<ERole> permissions = (List<ERole>) userSecurity.getAuthorities();
    return permissions.stream().findFirst().get();
  }
}
