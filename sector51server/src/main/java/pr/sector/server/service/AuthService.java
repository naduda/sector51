package pr.sector.server.service;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pr.sector.server.model.RoleName;
import pr.sector.server.model.User;
import pr.sector.server.payload.*;
import pr.sector.server.repository.RoleRepository;
import pr.sector.server.repository.UserRepository;
import pr.sector.server.security.JwtTokenProvider;

import java.util.Collections;

@Service
@AllArgsConstructor
public class AuthService {

    private AuthenticationManager authenticationManager;
    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;
    private JwtTokenProvider tokenProvider;

    public ResponseEntity<JwtAuthenticationResponse> login(LoginRequest loginRequest) {
        var authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        var jwt = tokenProvider.generateToken(authentication);
        return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));
    }

    public ResponseEntity<? extends Response> registerUser(SignUpRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return getNotSuccessResponseEntity("Username is already taken!");
        }

//        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
//            return getNotSuccessResponseEntity("Email Address already in use!");
//        }

        var user = new User(signUpRequest.getName(), signUpRequest.getUsername(),
                signUpRequest.getEmail(), signUpRequest.getPassword());

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        var userRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseThrow(() -> new IllegalStateException("User Role not set."));

        user.setRoles(Collections.singleton(userRole));

        var result = userRepository.save(user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new CreatedUserResponse(true, "User registered successfully", result.getId()));
    }

    private ResponseEntity<ApiResponse> getNotSuccessResponseEntity(String message) {
        return new ResponseEntity<>(new ApiResponse(false, message), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
