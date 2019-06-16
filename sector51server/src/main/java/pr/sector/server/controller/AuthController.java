package pr.sector.server.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pr.sector.server.dto.UserDTO;
import pr.sector.server.payload.JwtAuthenticationResponse;
import pr.sector.server.payload.LoginRequest;
import pr.sector.server.payload.Response;
import pr.sector.server.payload.SignUpRequest;
import pr.sector.server.service.AuthService;

import javax.validation.Valid;

@RestController
@AllArgsConstructor
@RequestMapping("auth")
public class AuthController {

    private AuthService authService;

    @PostMapping("login")
    public ResponseEntity<JwtAuthenticationResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        return authService.login(loginRequest);
    }

//    @PostMapping("signup")
//    public ResponseEntity<? extends Response> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
//        return authService.registerUser(signUpRequest);
//    }

    @PostMapping("signup")
    public ResponseEntity<String> createUser(@RequestBody UserDTO user) {
        System.out.println(user);
        return ResponseEntity.ok(null);
    }
}