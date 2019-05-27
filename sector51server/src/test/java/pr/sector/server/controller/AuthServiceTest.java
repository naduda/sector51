package pr.sector.server.controller;

import org.apache.commons.lang3.RandomStringUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import pr.sector.server.model.User;
import pr.sector.server.payload.ApiResponse;
import pr.sector.server.payload.LoginRequest;
import pr.sector.server.payload.SignUpRequest;
import pr.sector.server.repository.UserRepository;
import pr.sector.server.service.AuthService;

import static org.junit.Assert.*;

@SpringBootTest()
@RunWith(SpringJUnit4ClassRunner.class)
public class AuthServiceTest {

    private User testUser;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @Before
    public void before() {
        String randomName = RandomStringUtils.randomAlphabetic(10);
        testUser = new User();
        testUser.setEmail(randomName + "@gmail.com");
        testUser.setUsername(randomName);
        testUser.setPassword(randomName);
        testUser.setName(randomName);

        userRepository.save(testUser);
    }

    @After
    public void after() {
        userRepository.delete(testUser);
    }

//    @Test
    public void loginWithTestUser() {
        var result = authService.login(new LoginRequest(testUser.getUsername(), testUser.getPassword()));

        assertEquals(HttpStatus.OK, result.getStatusCode());

        var body = result.getBody();

        assertNotNull(body);
        assertNotNull(body.getTokenType());
        assertNotNull(body.getAccessToken());

        assertEquals("Bearer", body.getTokenType());
    }

    @Test
    public void registerNewUser() {
        var randomName = RandomStringUtils.randomAlphabetic(10);
        var email = randomName + "@gmail.com";

        var signUpRequest = new SignUpRequest(randomName, randomName, email, randomName);

        var response = authService.registerUser(signUpRequest);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());

        var user = userRepository.findByEmail(email);

        assertTrue(user.isPresent());

        user.ifPresent(value -> userRepository.delete(value));
    }

    @Test
    public void registerExistingUserName() {
        var signUpRequest = new SignUpRequest(testUser.getName(), testUser.getUsername(), testUser.getEmail(), testUser.getPassword());

        var response = authService.registerUser(signUpRequest);

        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());

        var apiResponse = (ApiResponse) response.getBody();

        assertNotNull(apiResponse);
        assertEquals("Username is already taken!", apiResponse.getMessage());
    }
}