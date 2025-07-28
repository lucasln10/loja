package com.lojacrysleao.lojacrysleao_api.service.loginAndRegisterService;

import com.lojacrysleao.lojacrysleao_api.dto.authDTO.RegisterRequest;
import com.lojacrysleao.lojacrysleao_api.dto.authDTO.RegisterResponse;
import com.lojacrysleao.lojacrysleao_api.model.user.Role;
import com.lojacrysleao.lojacrysleao_api.model.user.User;
import com.lojacrysleao.lojacrysleao_api.repository.userRepository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public RegisterResponse registerUser(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email já está em uso.");
        }

        User newUser = new User();
        newUser.setName(request.getName());
        newUser.setEmail(request.getEmail());
        newUser.setPhone(request.getPhone());
        newUser.setCpf(request.getCpf());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));

        // SEGURANÇA: Todos os novos usuários são USER por padrão
        newUser.setRole(Role.USER);

        User savedUser = userRepository.save(newUser);

        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole().name()
        );
    }
}
