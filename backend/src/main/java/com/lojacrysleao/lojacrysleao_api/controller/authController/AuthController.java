package com.lojacrysleao.lojacrysleao_api.controller.authController;

import com.lojacrysleao.lojacrysleao_api.dto.authDTO.LoginRequest;
import com.lojacrysleao.lojacrysleao_api.dto.authDTO.LoginResponse;
import com.lojacrysleao.lojacrysleao_api.dto.authDTO.RegisterRequest;
import com.lojacrysleao.lojacrysleao_api.dto.authDTO.RegisterResponse;
import com.lojacrysleao.lojacrysleao_api.dto.authDTO.UserDTO;
import com.lojacrysleao.lojacrysleao_api.dto.verifyDTO.PasswordResetTokenDTO;
import com.lojacrysleao.lojacrysleao_api.dto.verifyDTO.VerificationTokenDTO;
import com.lojacrysleao.lojacrysleao_api.service.loginAndRegisterService.AuthService;
import com.lojacrysleao.lojacrysleao_api.service.loginAndRegisterService.UserService;
import com.lojacrysleao.lojacrysleao_api.service.verifyService.PasswordResetTokenService;
import com.lojacrysleao.lojacrysleao_api.service.verifyService.VerificationTokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    @Autowired
    private VerificationTokenService verificationTokenService;

    @Autowired
    private PasswordResetTokenService passwordResetTokenService;


    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody @Valid RegisterRequest registerRequest) {
        RegisterResponse registerResponse = userService.registerUser(registerRequest);
        return ResponseEntity.ok(registerResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest loginRequest) {
        LoginResponse loginResponse = authService.authenticate(loginRequest);
        return ResponseEntity.ok(loginResponse);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        UserDTO userDTO = authService.getCurrentUser();
        return ResponseEntity.ok(userDTO);
    }

    @GetMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        VerificationTokenDTO tokenDTO = verificationTokenService.validateToken(token);
        userService.verifyUserAccount(tokenDTO.getUserId());
        verificationTokenService.deleteToken(token);
        
        return ResponseEntity.ok("Conta verificada com sucesso!");
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<String> resendVerificationEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        userService.resendVerificationEmail(email);
        return ResponseEntity.ok("E-mail de verificação reenviado!");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("E-mail é obrigatório");
        }
        userService.requestPasswordReset(email);
        return ResponseEntity.ok("Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestBody Map<String, String> request) {
        String newPassword = request.get("password");
        
        PasswordResetTokenDTO tokenDTO = passwordResetTokenService.validateToken(token);
        userService.resetPassword(tokenDTO.getUserId(), newPassword);
        passwordResetTokenService.deleteToken(token);
        
        return ResponseEntity.ok("Senha redefinida com sucesso!");
    }

    @GetMapping("/validate-reset-token")
    public ResponseEntity<Map<String, String>> validateResetToken(@RequestParam String token) {
        PasswordResetTokenDTO tokenDTO = passwordResetTokenService.validateToken(token);
        Map<String, String> response = Map.of(
            "status", "valid",
            "message", "Token válido",
            "email", tokenDTO.getUserEmail() != null ? tokenDTO.getUserEmail() : ""
        );
        return ResponseEntity.ok(response);
    }
}
