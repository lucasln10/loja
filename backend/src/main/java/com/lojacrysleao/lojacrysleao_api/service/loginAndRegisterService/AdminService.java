package com.lojacrysleao.lojacrysleao_api.service.loginAndRegisterService;

import com.lojacrysleao.lojacrysleao_api.dto.authDTO.UserDTO;
import com.lojacrysleao.lojacrysleao_api.exception.BadRequestException;
import com.lojacrysleao.lojacrysleao_api.exception.ResourceNotFoundException;
import com.lojacrysleao.lojacrysleao_api.model.user.Role;
import com.lojacrysleao.lojacrysleao_api.model.user.User;
import com.lojacrysleao.lojacrysleao_api.repository.userRepository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    public void promoteUserToAdmin(Long userId) {
        if (userId == null) {
            throw new BadRequestException("ID do usuário é obrigatório");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário com ID " + userId + " não encontrado"));
        
        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("Usuário já possui permissões de administrador");
        }
        
        user.setRole(Role.ADMIN);
        userRepository.save(user);
    }

    public void demoteUserToUser(Long userId) {
        if (userId == null) {
            throw new BadRequestException("ID do usuário é obrigatório");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário com ID " + userId + " não encontrado"));
        
        if (user.getRole() == Role.USER) {
            throw new BadRequestException("Usuário já possui permissões de usuário comum");
        }
        
        user.setRole(Role.USER);
        userRepository.save(user);
    }

    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(user -> new UserDTO(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole().name()
                ))
                .collect(Collectors.toList());
    }
}
