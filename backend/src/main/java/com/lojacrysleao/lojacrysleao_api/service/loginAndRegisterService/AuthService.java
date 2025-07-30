package com.lojacrysleao.lojacrysleao_api.service.loginAndRegisterService;

import com.lojacrysleao.lojacrysleao_api.config.JWT.JwtTokenProvider;
import com.lojacrysleao.lojacrysleao_api.dto.authDTO.LoginRequest;
import com.lojacrysleao.lojacrysleao_api.dto.authDTO.LoginResponse;
import com.lojacrysleao.lojacrysleao_api.dto.authDTO.UserDTO;
import com.lojacrysleao.lojacrysleao_api.model.user.User;
import com.lojacrysleao.lojacrysleao_api.repository.userRepository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

    public LoginResponse authenticate(LoginRequest request) {
        System.out.println("Tentativa de login para: " + request.getEmail());
        
        // Verifica se o usuário existe e está habilitado
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    System.out.println("Usuário não encontrado: " + request.getEmail());
                    return new RuntimeException("Email ou senha inválidos");
                });

        System.out.println("Usuário encontrado: " + user.getName() + ", Role: " + user.getRole() + ", Enable: " + user.isEnable());

        if (!user.isEnable()) {
            System.out.println("Usuário não está habilitado: " + user.getEmail());
            throw new DisabledException("Conta não verificada. Verifique seu email.");
        }

        // Autentica o usuário com e-mail e senha
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        System.out.println("Autenticação bem-sucedida para: " + request.getEmail());

        // Gera o token JWT com base no e-mail
        String token = jwtTokenProvider.generateToken(request.getEmail());

        LoginResponse response = new LoginResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
        
        System.out.println("Login response gerado: " + response.getUser().getRole());
        return response;
    }

    public UserDTO getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}