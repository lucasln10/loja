package com.lojacrysleao.lojacrysleao_api.controller.auth;

import com.lojacrysleao.lojacrysleao_api.dto.dtoAuth.LoginRequest;
import com.lojacrysleao.lojacrysleao_api.dto.dtoAuth.LoginResponse;
import com.lojacrysleao.lojacrysleao_api.dto.dtoAuth.RegisterRequest;
import com.lojacrysleao.lojacrysleao_api.dto.dtoAuth.RegisterResponse;
import com.lojacrysleao.lojacrysleao_api.service.loginService.AuthService;
import com.lojacrysleao.lojacrysleao_api.service.loginService.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> regiter(@RequestBody @Valid RegisterRequest registerRequest) {
        RegisterResponse registerResponse = userService.registerUser(registerRequest);
        return ResponseEntity.ok(registerResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest loginRequest) {
        LoginResponse loginResponse = authService.authenticate(loginRequest);
        return ResponseEntity.ok(loginResponse);
    }

}
