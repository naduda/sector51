//package pr.sector.server.config;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.config.authentication.AuthenticationManager;
//import org.springframework.config.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
//import org.springframework.config.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
//import org.springframework.config.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
//import org.springframework.config.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
//import org.springframework.config.oauth2.provider.token.TokenEnhancerChain;
//import org.springframework.config.oauth2.provider.token.TokenStore;
//import org.springframework.config.oauth2.provider.token.store.JwtAccessTokenConverter;
//
//import java.util.Arrays;
//import java.util.Collections;
//
//@Configuration
//@EnableAuthorizationServer
//@RequiredArgsConstructor
//public class AuthorizationServerConfig extends AuthorizationServerConfigurerAdapter {
//
//    @Value("${config.jwt.client-id}")
//    private String clientId;
//
//    @Value("${config.jwt.client-secret}")
//    private String clientSecret;
//
//    @Value("${config.jwt.grant-type}")
//    private String grantType;
//
//    @Value("${config.jwt.scope-read}")
//    private String scopeRead;
//
//    @Value("${config.jwt.scope-write}")
//    private String scopeWrite = "write";
//
//    @Value("${config.jwt.resource-ids}")
//    private String resourceIds;
//
////    @Autowired
//    private TokenStore tokenStore;
//
////    @Autowired
//    private JwtAccessTokenConverter accessTokenConverter;
//
////    @Autowired
//    private AuthenticationManager authenticationManager;
//
//    @Override
//    public void configure(ClientDetailsServiceConfigurer configurer) throws Exception {
//        configurer
//                .inMemory()
//                .withClient(clientId)
//                .secret(clientSecret)
//                .authorizedGrantTypes(grantType)
//                .scopes(scopeRead, scopeWrite)
//                .resourceIds(resourceIds);
//    }
//
//    @Override
//    public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
//        TokenEnhancerChain enhancerChain = new TokenEnhancerChain();
//        enhancerChain.setTokenEnhancers(Collections.singletonList(accessTokenConverter));
//        endpoints.tokenStore(tokenStore)
//                .accessTokenConverter(accessTokenConverter)
//                .tokenEnhancer(enhancerChain)
//                .authenticationManager(authenticationManager);
//    }
//
//}
