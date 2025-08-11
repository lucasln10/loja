package com.lojacrysleao.lojacrysleao_api.service.userService;

import com.lojacrysleao.lojacrysleao_api.dto.authDTO.RegisterRequest;
import com.lojacrysleao.lojacrysleao_api.dto.authDTO.RegisterResponse;
import com.lojacrysleao.lojacrysleao_api.exception.ConflictException;
import com.lojacrysleao.lojacrysleao_api.model.user.User;
import com.lojacrysleao.lojacrysleao_api.repository.userRepository.UserRepository;
import com.lojacrysleao.lojacrysleao_api.service.emailService.EmailService;
import com.lojacrysleao.lojacrysleao_api.service.verifyService.VerificationTokenService;
import com.lojacrysleao.lojacrysleao_api.service.verifyService.PasswordResetTokenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private VerificationTokenService verificationTokenService;
    @Mock
    private PasswordResetTokenService passwordResetTokenService;
    @Mock
    private EmailService emailService;
    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterUserSuccess() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Teste");
        request.setEmail("teste@email.com");
        request.setPhone("123456789");
        request.setCpf("12345678900");
        request.setPassword("senha");
        when(userRepository.findByEmail("teste@email.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("senha")).thenReturn("senhaCodificada");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(verificationTokenService.createVerificationToken(any(User.class))).thenReturn(null);
        doNothing().when(emailService).sendEmail(anyString(), anyString(), anyString());
        RegisterResponse response = userService.registerUser(request);
        assertNotNull(response);
        assertEquals("teste@email.com", response.getEmail());
    }

    @Test
    void testRegisterUserEmailConflict() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("teste@email.com");
        when(userRepository.findByEmail("teste@email.com")).thenReturn(Optional.of(new User()));
        assertThrows(ConflictException.class, () -> userService.registerUser(request));
    }
}
