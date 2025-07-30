package com.lojacrysleao.lojacrysleao_api.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.lojacrysleao.lojacrysleao_api.model.user.Role;
import com.lojacrysleao.lojacrysleao_api.model.user.User;
import com.lojacrysleao.lojacrysleao_api.repository.userRepository.UserRepository;

@Component
public class DataInitializer {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @EventListener
    public void onApplicationEvent(ContextRefreshedEvent event) {
        createDefaultAdmin();
    }

    private void createDefaultAdmin() {
        System.out.println("Verificando se admin padrão existe...");
        // Verifica se já existe um admin
        if (userRepository.findByEmail("admin@lojacrysleao.com").isEmpty()) {
            System.out.println("Admin não encontrado, criando...");
            User admin = new User();
            admin.setName("Administrador");
            admin.setEmail("admin@lojacrysleao.com");
            admin.setPhone("11999999999");
            admin.setCpf("00000000000");
            admin.setPassword(passwordEncoder.encode("admin123456"));
            admin.setRole(Role.ADMIN);
            admin.setEnable(true); // Admin deve estar habilitado por padrão
            
            User savedAdmin = userRepository.save(admin);
            System.out.println("Admin padrão criado com sucesso! ID: " + savedAdmin.getId());
        } else {
            System.out.println("Admin padrão já existe!");
        }
    }
}
