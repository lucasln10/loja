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

        // Remove tokens antigos antes de criar um novo
        passwordResetTokenService.deleteTokensByUserId(user.getId());
        
        PasswordResetTokenDTO tokenDTO = passwordResetTokenService.createPasswordResetToken(user);
        sendPasswordResetEmail(user, tokenDTO.getToken());
    }

    /**
     * Redefine a senha do usuário
     */
    public void resetPassword(Long userId, String newPassword) {
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new RuntimeException("Nova senha não pode ser vazia");
        }
        
        if (newPassword.length() < 6) {
            throw new RuntimeException("A senha deve ter pelo menos 6 caracteres");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        System.out.println("Senha redefinida com sucesso para o usuário: " + user.getEmail());
    }

    /**
     * Envia email de verificação (método privado auxiliar)
     */
    private void sendVerificationEmail(User user) {
        VerificationTokenDTO tokenDTO = verificationTokenService.createVerificationToken(user);
        
        // URL que redireciona para o frontend com o token
        String verifyUrl = "http://localhost:3000/verificar-email?token=" + tokenDTO.getToken();
        
        // TODO: Implementar envio de email
        // emailService.sendEmail(user.getEmail(), "Confirme seu cadastro - Loja Crysleão", 
        //     "Olá " + user.getName() + ",\n\n" +
        //     "Bem-vindo à Loja Crysleão!\n" +
        //     "Para ativar sua conta, clique no link abaixo:\n\n" +
        //     verifyUrl + "\n\n" +
        //     "Este link é válido por tempo limitado.\n" +
        //     "Se você não se cadastrou em nosso site, ignore este e-mail.\n\n" +
        //     "Atenciosamente,\nEquipe Loja Crysleão");
        
        System.out.println("===== EMAIL DE VERIFICAÇÃO =====");
        System.out.println("Para: " + user.getEmail());
        System.out.println("Nome: " + user.getName());
        System.out.println("Link de verificação: " + verifyUrl);
        System.out.println("Token: " + tokenDTO.getToken());
        System.out.println("==================================");
    }

    /**
     * Envia email de redefinição de senha (método privado auxiliar)
     */
    private void sendPasswordResetEmail(User user, String token) {
        // URL que redireciona para o frontend com o token
        String resetUrl = "http://localhost:3000/redefinir-senha?token=" + token;
        
        // TODO: Implementar envio de email
        // emailService.sendEmail(user.getEmail(), "Redefina sua senha - Loja Crysleão", 
        //     "Olá " + user.getName() + ",\n\n" +
        //     "Você solicitou a redefinição de sua senha.\n" +
        //     "Clique no link abaixo para redefinir sua senha:\n\n" +
        //     resetUrl + "\n\n" +
        //     "Este link é válido por 24 horas.\n" +
        //     "Se você não solicitou esta redefinição, ignore este e-mail.\n\n" +
        //     "Atenciosamente,\nEquipe Loja Crysleão");
        
        System.out.println("===== EMAIL DE REDEFINIÇÃO DE SENHA =====");
        System.out.println("Para: " + user.getEmail());
        System.out.println("Nome: " + user.getName());
        System.out.println("Link de redefinição: " + resetUrl);
        System.out.println("Token: " + token);
        System.out.println("Token válido por: 24 horas");
        System.out.println("=========================================");
    }
}
