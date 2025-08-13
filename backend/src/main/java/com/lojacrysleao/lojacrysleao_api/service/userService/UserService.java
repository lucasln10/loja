package com.lojacrysleao.lojacrysleao_api.service.userService;

import java.util.Date;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lojacrysleao.lojacrysleao_api.dto.authDTO.RegisterRequest;
import com.lojacrysleao.lojacrysleao_api.dto.authDTO.RegisterResponse;
import com.lojacrysleao.lojacrysleao_api.dto.verifyDTO.PasswordResetTokenDTO;
import com.lojacrysleao.lojacrysleao_api.dto.verifyDTO.VerificationTokenDTO;
import com.lojacrysleao.lojacrysleao_api.exception.BadRequestException;
import com.lojacrysleao.lojacrysleao_api.exception.ConflictException;
import com.lojacrysleao.lojacrysleao_api.exception.ResourceNotFoundException;
import com.lojacrysleao.lojacrysleao_api.exception.ValidationException;
import com.lojacrysleao.lojacrysleao_api.model.loja.Product;
import com.lojacrysleao.lojacrysleao_api.model.user.Role;
import com.lojacrysleao.lojacrysleao_api.model.user.User;
import com.lojacrysleao.lojacrysleao_api.repository.lojaRepository.ProductRepository;
import com.lojacrysleao.lojacrysleao_api.repository.userRepository.UserRepository;
import com.lojacrysleao.lojacrysleao_api.service.emailService.EmailService;
import com.lojacrysleao.lojacrysleao_api.service.verifyService.PasswordResetTokenService;
import com.lojacrysleao.lojacrysleao_api.service.verifyService.VerificationTokenService;

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

    @Autowired
    private EmailService emailService;

    @Autowired
    private ProductRepository productRepository;

    public RegisterResponse registerUser(RegisterRequest request) {
        try {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new ConflictException("Email já está em uso.");
            }

            User newUser = new User();
            newUser.setName(request.getName());
            newUser.setEmail(request.getEmail());
            newUser.setPhone(request.getPhone());
            newUser.setCpf(request.getCpf());
            newUser.setPassword(passwordEncoder.encode(request.getPassword()));
            newUser.setEnable(false);
            newUser.setRole(Role.USER);
            newUser.setCreated_at(new Date());

            User savedUser = userRepository.save(newUser);
            sendVerificationEmail(savedUser);
            return new RegisterResponse(
                    savedUser.getId(),
                    savedUser.getName(),
                    savedUser.getEmail(),
                    savedUser.getRole().name()
            );
        } catch (Exception e) {
            throw new ConflictException("Erro ao criar Usuario");
        }
    }

    /**
     * Verifica a conta do usuário
     */
    public void verifyUserAccount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        
        user.setEnable(true);
        userRepository.save(user);
    }

    /**
     * Reenvia email de verificação
     */
    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        
        if (user.isEnable()) {
            throw new ValidationException("Conta já verificada");
        }

        sendVerificationEmail(user);
    }

    /**
     * Solicita redefinição de senha
     */
    public void requestPasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

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
            throw new BadRequestException("Nova senha não pode ser vazia");
        }
        
        if (newPassword.length() < 8) {
            throw new BadRequestException("A senha deve ter pelo menos 6 caracteres");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    /**
     * Envia email de verificação (método privado auxiliar)
     */
    private void sendVerificationEmail(User user) {
        try {
            VerificationTokenDTO tokenDTO = verificationTokenService.createVerificationToken(user);

            // URL que redireciona para o frontend com o token
            String verifyUrl = "http://localhost:3000/verificar-email?token=" + tokenDTO.getToken();

            // Usar template HTML bonito ao invés de texto simples
            String htmlContent = emailService.createVerificationEmailTemplate(user.getName(), verifyUrl);
            emailService.sendHtmlEmail(user.getEmail(), "Confirme seu cadastro - Loja Crysleão", htmlContent);
        } catch (Exception e) {
            throw new BadRequestException("Erro ao enviar email de verificação");
        }
    }

    /**
     * Envia email de redefinição de senha (método privado auxiliar)
     */
    private void sendPasswordResetEmail(User user, String token) {
        try {
            // URL que redireciona para o frontend com o token
            String resetUrl = "http://localhost:3000/redefinir-senha?token=" + token;

            // Usar template HTML bonito ao invés de texto simples
            String htmlContent = emailService.createPasswordResetEmailTemplate(user.getName(), resetUrl);
            emailService.sendHtmlEmail(user.getEmail(), "Redefina sua senha - Loja Crysleão", htmlContent);
        } catch (Exception e) {
            throw new BadRequestException("Erro ao enviar email de redefinição de senha");
        }

    }

    @Transactional
    public void addFavorite(Long userId, Long productId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("user ID nao foi encontrado."));
        Product product = productRepository.findById(productId).orElseThrow(() -> new ResourceNotFoundException("product ID nao foi encontrado."));
        boolean alreadyFavorited = user.getFavorites().stream()
            .anyMatch(p -> p.getId().equals(productId));
        if (!alreadyFavorited) {
            user.addFavorite(product);
        }
        userRepository.save(user);
    }

    @Transactional
    public void removeFavorite(Long userId, Long productId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("user ID nao foi encontrado."));
    // remove pelo ID para evitar problemas de equals/hashCode entre instâncias diferentes
        user.getFavorites().removeIf(p -> p.getId().equals(productId));
            userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public Set<Product> listFavorites(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("user ID nao foi encontrado."));
        // Força carga da coleção de favoritos antes de sair da transação
        user.getFavorites().size();
        return user.getFavorites();
    }

}
