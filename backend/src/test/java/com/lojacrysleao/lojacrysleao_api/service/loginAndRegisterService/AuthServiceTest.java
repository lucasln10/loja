package com.lojacrysleao.lojacrysleao_api.service.loginAndRegisterService;

import com.lojacrysleao.lojacrysleao_api.config.JWT.JwtTokenProvider;
import com.lojacrysleao.lojacrysleao_api.dto.authDTO.LoginRequest;
import com.lojacrysleao.lojacrysleao_api.dto.authDTO.LoginResponse;
import com.lojacrysleao.lojacrysleao_api.exception.ValidationException;
import com.lojacrysleao.lojacrysleao_api.mapper.userMapper.UserMapper;
import com.lojacrysleao.lojacrysleao_api.model.user.User;
import com.lojacrysleao.lojacrysleao_api.repository.userRepository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import com.lojacrysleao.lojacrysleao_api.exception.UnauthorizedException;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JwtTokenProvider jwtTokenProvider;
    @Mock
    private UserRepository userRepository;
    @Mock
    private UserMapper userMapper;
    @InjectMocks
    private AuthService authService;
    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setId(1L);
        user.setName("Teste");
        user.setEmail("teste@email.com");
        user.setEnable(true);
    }

    @Test
    void testAuthenticateSuccess() {
        LoginRequest request = new LoginRequest();
        request.setEmail("teste@email.com");
        request.setPassword("senha");
        when(userRepository.findByEmail("teste@email.com")).thenReturn(Optional.of(user));
        Authentication mockAuth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(mockAuth);
        when(jwtTokenProvider.generateToken("teste@email.com")).thenReturn("token123");
        user.setRole(com.lojacrysleao.lojacrysleao_api.model.user.Role.USER);
        LoginResponse response = authService.authenticate(request);
        assertNotNull(response);
        assertEquals("token123", response.getAccessToken());
        assertEquals(1L, response.getUser().getId());
    }

    @Test
    void testAuthenticateUserNotEnabled() {
        user.setEnable(false);
        LoginRequest request = new LoginRequest();
        request.setEmail("teste@email.com");
        request.setPassword("senha");
        when(userRepository.findByEmail("teste@email.com")).thenReturn(Optional.of(user));
        assertThrows(UnauthorizedException.class, () -> authService.authenticate(request));
    }

    @Test
    void testAuthenticateUserNotFound() {
        LoginRequest request = new LoginRequest();
        request.setEmail("naoexiste@email.com");
        request.setPassword("senha");
        when(userRepository.findByEmail("naoexiste@email.com")).thenReturn(Optional.empty());
        assertThrows(UnauthorizedException.class, () -> authService.authenticate(request));
    }
}
