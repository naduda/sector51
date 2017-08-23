package pr.sector51.server.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
  @Autowired
  private StatelessAuthFilter authFilter;

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
        .csrf().disable()
        .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class)
        .authorizeRequests()
        .antMatchers("/", "/api/login", "/api/test", "/*.html", "/*.css", "/*.js", "/*.ico",
            "/*.woff", "/*.woff2", "/*.ttf", "/assets/**", "/**/counter").permitAll()
        .anyRequest().authenticated()
        .and()
//        .formLogin().loginPage("/").permitAll()
//        .and()
        .logout().permitAll();
  }
}
