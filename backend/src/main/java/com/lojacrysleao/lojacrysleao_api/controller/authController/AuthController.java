package com.lojacrysleao.lojacrysleao_api.controller.authController;

import com.lojacrysleao.lojacrysleao_api.dto.authDTO.LoginRequest;
import com.lojacrysleao.lojacrysleao_api.dto.authDTO.LoginResponse;
import com.lojacrysleao.lojacrysleao_api.dto.authDTO.RegisterRequest;
import com.lojacrysleao.lojacrysleao_api.dto.authDTO.RegisterResponse;
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
        try {
            RegisterResponse registerResponse = userService.registerUser(registerRequest);
            return ResponseEntity.ok(registerResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest loginRequest) {
        try {
            LoginResponse loginResponse = authService.authenticate(loginRequest);
            return ResponseEntity.ok(loginResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        try {
            VerificationTokenDTO tokenDTO = verificationTokenService.validateToken(token);
            userService.verifyUserAccount(tokenDTO.getUserId());
            verificationTokenService.deleteToken(token);
            
            return ResponseEntity.ok("Conta verificada com sucesso!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<String> resendVerificationEmail(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            userService.resendVerificationEmail(email);
            return ResponseEntity.ok("E-mail de verificação reenviado!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            userService.requestPasswordReset(email);
            return ResponseEntity.ok("E-mail para redefinir senha enviado!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestBody Map<String, String> request) {
        try {
            String newPassword = request.get("password");
            PasswordResetTokenDTO tokenDTO = passwordResetTokenService.validateToken(token);
            userService.resetPassword(tokenDTO.getUserId(), newPassword);
            passwordResetTokenService.deleteToken(token);
            
            return ResponseEntity.ok("Senha redefinida com sucesso!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/validate-reset-token")
    public ResponseEntity<String> validateResetToken(@RequestParam String token) {
        try {
            passwordResetTokenService.validateToken(token);
            return ResponseEntity.ok("Token válido");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
