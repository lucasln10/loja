package com.lojacrysleao.lojacrysleao_api.service.loginAndRegisterService;

import com.lojacrysleao.lojacrysleao_api.config.JWT.JwtTokenProvider;
import com.lojacrysleao.lojacrysleao_api.dto.authDTO.LoginRequest;
import com.lojacrysleao.lojacrysleao_api.dto.authDTO.LoginResponse;
import com.lojacrysleao.lojacrysleao_api.model.user.User;
import com.lojacrysleao.lojacrysleao_api.repository.userRepository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public LoginResponse authenticate(LoginRequest request) {
        // Autentica o usuário com e-mail e senha
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Gera o token JWT com base no e-mail
        String token = jwtTokenProvider.generateToken(request.getEmail());

        // Recupera o usuário para preencher os dados na resposta
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return new LoginResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}