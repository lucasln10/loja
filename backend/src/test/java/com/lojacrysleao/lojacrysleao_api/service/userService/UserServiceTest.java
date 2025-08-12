package com.lojacrysleao.lojacrysleao_api.service.userService;

import com.lojacrysleao.lojacrysleao_api.dto.authDTO.RegisterRequest;
import com.lojacrysleao.lojacrysleao_api.dto.authDTO.RegisterResponse;
import com.lojacrysleao.lojacrysleao_api.dto.verifyDTO.VerificationTokenDTO;
import com.lojacrysleao.lojacrysleao_api.dto.verifyDTO.PasswordResetTokenDTO;
import com.lojacrysleao.lojacrysleao_api.exception.BadRequestException;
import com.lojacrysleao.lojacrysleao_api.exception.ConflictException;
import com.lojacrysleao.lojacrysleao_api.exception.ResourceNotFoundException;
import com.lojacrysleao.lojacrysleao_api.exception.ValidationException;
import com.lojacrysleao.lojacrysleao_api.model.loja.Product;
import com.lojacrysleao.lojacrysleao_api.model.user.User;
import com.lojacrysleao.lojacrysleao_api.repository.lojaRepository.ProductRepository;
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

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

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
    @Mock
    private ProductRepository productRepository;
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
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(1L);
            return u;
        });
        VerificationTokenDTO tokenDTO = new VerificationTokenDTO();
        tokenDTO.setToken("abc");
        when(verificationTokenService.createVerificationToken(any(User.class))).thenReturn(tokenDTO);
        when(emailService.createVerificationEmailTemplate(anyString(), anyString())).thenReturn("<html></html>");
        doNothing().when(emailService).sendHtmlEmail(anyString(), anyString(), anyString());
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

    @Test
    void testVerifyUserAccount() {
        User user = new User();
        user.setId(1L);
        user.setEnable(false);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);
        userService.verifyUserAccount(1L);
        assertTrue(user.isEnable());
    }

    @Test
    void testResendVerificationEmail() {
        User user = new User();
        user.setId(1L);
        user.setName("Teste");
        user.setEmail("x@y.com");
        user.setEnable(false);
        when(userRepository.findByEmail("x@y.com")).thenReturn(Optional.of(user));
        VerificationTokenDTO tokenDTO = new VerificationTokenDTO();
        tokenDTO.setToken("abc");
        when(verificationTokenService.createVerificationToken(user)).thenReturn(tokenDTO);
        when(emailService.createVerificationEmailTemplate(anyString(), anyString())).thenReturn("<html></html>");
        doNothing().when(emailService).sendHtmlEmail(anyString(), anyString(), anyString());
        userService.resendVerificationEmail("x@y.com");
        verify(verificationTokenService).createVerificationToken(user);
    }

    @Test
    void testResendVerificationEmailAlreadyEnabled() {
        User user = new User();
        user.setEmail("x@y.com");
        user.setEnable(true);
        when(userRepository.findByEmail("x@y.com")).thenReturn(Optional.of(user));
        assertThrows(ValidationException.class, () -> userService.resendVerificationEmail("x@y.com"));
    }

    @Test
    void testRequestPasswordReset() {
        User user = new User();
        user.setId(1L);
        user.setName("Teste");
        user.setEmail("x@y.com");
        when(userRepository.findByEmail("x@y.com")).thenReturn(Optional.of(user));
        doNothing().when(passwordResetTokenService).deleteTokensByUserId(1L);
        PasswordResetTokenDTO prt = new PasswordResetTokenDTO();
        prt.setToken("rst");
        when(passwordResetTokenService.createPasswordResetToken(user)).thenReturn(prt);
        when(emailService.createPasswordResetEmailTemplate(anyString(), anyString())).thenReturn("<html></html>");
        doNothing().when(emailService).sendHtmlEmail(anyString(), anyString(), anyString());
        userService.requestPasswordReset("x@y.com");
        verify(passwordResetTokenService).deleteTokensByUserId(1L);
        verify(passwordResetTokenService).createPasswordResetToken(user);
    }

    @Test
    void testResetPasswordValidations() {
        assertThrows(BadRequestException.class, () -> userService.resetPassword(1L, " "));
        assertThrows(BadRequestException.class, () -> userService.resetPassword(1L, "short"));
    }

    @Test
    void testResetPasswordSuccess() {
        User user = new User();
        user.setId(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode("newpassword")).thenReturn("enc");
        when(userRepository.save(user)).thenReturn(user);
        userService.resetPassword(1L, "newpassword");
        assertEquals("enc", user.getPassword());
    }

    @Test
    void testFavoritesFlow() {
        User user = new User();
        user.setId(1L);
        Product product = new Product();
        product.setId(10L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));
        userService.addFavorite(1L, 10L);
        assertTrue(user.getFavorites().stream().anyMatch(p -> p.getId().equals(10L)));
        userService.removeFavorite(1L, 10L);
        assertTrue(user.getFavorites().isEmpty());
        Set<Product> favorites = userService.listFavorites(1L);
        assertNotNull(favorites);
    }
}
