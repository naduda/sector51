package pr.sector51.server.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    private StatelessAuthFilter authFilter;

    @Autowired
    public SecurityConfig(StatelessAuthFilter authFilter) {
        this.authFilter = authFilter;
    }

    @Bean
    public RoleHierarchy roleHierarchy() {
        RoleHierarchyImpl roleHierarchy = new RoleHierarchyImpl();
        roleHierarchy.setHierarchy(ERole.getHierarchy());
        return roleHierarchy;
    }

    @Override
    public void configure(WebSecurity web) {
        web.ignoring().antMatchers("/**/wsapi", "/api/public/**", "/api/scanner", "/assets/**",
                "/**/*.css", "/**/*.js", "/**/*.ico", "/**/*.eot", "/**/*.svg", "/**/*.woff*", "/**/*.ttf");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeRequests()
                .antMatchers("/").permitAll()
                .antMatchers("/api/delete/**").hasAuthority(ERole.ADMIN.getAuthority())
                .antMatchers("/api/add/userWithServices").hasAuthority(ERole.OWNER.getAuthority())
                .antMatchers("/api/add/**").hasAuthority(ERole.ADMIN.getAuthority())
                .antMatchers("/api/update/events/**").hasAuthority(ERole.OWNER.getAuthority())
                .antMatchers("/api/update/**").hasAuthority(ERole.ADMIN.getAuthority())
                .anyRequest().authenticated()
                .and()
                .logout().permitAll();
    }
}
