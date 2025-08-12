package com.lojacrysleao.lojacrysleao_api.controller.authController;

import com.lojacrysleao.lojacrysleao_api.dto.authDTO.*;
import com.lojacrysleao.lojacrysleao_api.dto.verifyDTO.PasswordResetTokenDTO;
import com.lojacrysleao.lojacrysleao_api.dto.verifyDTO.VerificationTokenDTO;
import com.lojacrysleao.lojacrysleao_api.service.loginAndRegisterService.AuthService;
import com.lojacrysleao.lojacrysleao_api.service.userService.UserService;
import com.lojacrysleao.lojacrysleao_api.service.verifyService.PasswordResetTokenService;
import com.lojacrysleao.lojacrysleao_api.service.verifyService.VerificationTokenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import java.util.Map;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class AuthControllerTest {
    @Mock private AuthService authService;
    @Mock private UserService userService;
    @Mock private VerificationTokenService verificationTokenService;
    @Mock private PasswordResetTokenService passwordResetTokenService;
    @InjectMocks private AuthController authController;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
    }

    @Test
    void testLogin() throws Exception {
        LoginResponse resp = new LoginResponse("tok", 1L, "n","e","USER");
        when(authService.authenticate(any(LoginRequest.class))).thenReturn(resp);
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"e\",\"password\":\"p\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void testRegister() throws Exception {
        RegisterResponse reg = new RegisterResponse(1L, "n","e","USER");
        when(userService.registerUser(any(RegisterRequest.class))).thenReturn(reg);
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"n\",\"email\":\"e\",\"password\":\"p\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void testVerifyEmail() throws Exception {
        VerificationTokenDTO tokenDTO = new VerificationTokenDTO();
        tokenDTO.setUserId(1L);
        when(verificationTokenService.validateToken("t")).thenReturn(tokenDTO);
        doNothing().when(verificationTokenService).deleteToken("t");
        mockMvc.perform(get("/api/auth/verify-email").param("token","t"))
                .andExpect(status().isOk());
    }

    @Test
    void testForgotPassword() throws Exception {
        doNothing().when(userService).requestPasswordReset("e");
        mockMvc.perform(post("/api/auth/forgot-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"e\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void testResetPassword() throws Exception {
        PasswordResetTokenDTO tokenDTO = new PasswordResetTokenDTO();
        tokenDTO.setUserId(1L);
        when(passwordResetTokenService.validateToken("t")).thenReturn(tokenDTO);
        doNothing().when(passwordResetTokenService).deleteToken("t");
        mockMvc.perform(post("/api/auth/reset-password").param("token","t")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"password\":\"new\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void testValidateResetToken() throws Exception {
        PasswordResetTokenDTO tokenDTO = new PasswordResetTokenDTO();
        tokenDTO.setUserEmail("e");
        when(passwordResetTokenService.validateToken("t")).thenReturn(tokenDTO);
        mockMvc.perform(get("/api/auth/validate-reset-token").param("token","t"))
                .andExpect(status().isOk());
    }
}
