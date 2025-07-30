package com.lojacrysleao.lojacrysleao_api.service.loginAndRegisterService;

import com.lojacrysleao.lojacrysleao_api.dto.authDTO.RegisterRequest;
import com.lojacrysleao.lojacrysleao_api.dto.authDTO.RegisterResponse;
import com.lojacrysleao.lojacrysleao_api.dto.verifyDTO.PasswordResetTokenDTO;
import com.lojacrysleao.lojacrysleao_api.dto.verifyDTO.VerificationTokenDTO;
import com.lojacrysleao.lojacrysleao_api.model.user.Role;
import com.lojacrysleao.lojacrysleao_api.model.user.User;
import com.lojacrysleao.lojacrysleao_api.repository.userRepository.UserRepository;
import com.lojacrysleao.lojacrysleao_api.service.verifyService.PasswordResetTokenService;
import com.lojacrysleao.lojacrysleao_api.service.verifyService.VerificationTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private VerificationTokenService verificationTokenService;

    @Autowired
    private PasswordResetTokenService passwordResetTokenService;

    // @Autowired
    // private EmailService emailService; // Assumindo que você tenha um serviço de email

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
        newUser.setEnable(false); // Usuário inicia desabilitado até verificar email

        // SEGURANÇA: Todos os novos usuários são USER por padrão
        newUser.setRole(Role.USER);

        User savedUser = userRepository.save(newUser);

        // Envia email de verificação
        sendVerificationEmail(savedUser);

        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole().name()
        );
    }

    /**
     * Verifica a conta do usuário
     */
    public void verifyUserAccount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        user.setEnable(true);
        userRepository.save(user);
    }

    /**
     * Reenvia email de verificação
     */
    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        if (user.isEnable()) {
            throw new RuntimeException("Conta já verificada");
        }

        sendVerificationEmail(user);
    }

    /**
     * Solicita redefinição de senha
     */
    public void requestPasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        PasswordResetTokenDTO tokenDTO = passwordResetTokenService.createPasswordResetToken(user);
        sendPasswordResetEmail(user, tokenDTO.getToken());
    }

    /**
     * Redefine a senha do usuário
     */
    public void resetPassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    /**
     * Envia email de verificação (método privado auxiliar)
     */
    private void sendVerificationEmail(User user) {
        VerificationTokenDTO tokenDTO = verificationTokenService.createVerificationToken(user);
        
        String verifyUrl = "http://localhost:8080/api/auth/verify-email?token=" + tokenDTO.getToken();
        
        // TODO: Implementar envio de email
        // emailService.sendEmail(user.getEmail(), "Confirme seu cadastro", 
        //     "Clique aqui para verificar sua conta: " + verifyUrl);
        
        System.out.println("Email de verificação enviado para: " + user.getEmail());
        System.out.println("Link de verificação: " + verifyUrl);
    }

    /**
     * Envia email de redefinição de senha (método privado auxiliar)
     */
    private void sendPasswordResetEmail(User user, String token) {
        String resetUrl = "http://localhost:8080/api/auth/reset-password?token=" + token;
        
        // TODO: Implementar envio de email
        // emailService.sendEmail(user.getEmail(), "Redefina sua senha", 
        //     "Clique aqui para redefinir sua senha: " + resetUrl);
        
        System.out.println("Email de redefinição enviado para: " + user.getEmail());
        System.out.println("Link de redefinição: " + resetUrl);
    }
}
