package com.lojacrysleao.lojacrysleao_api.service.verifyService;

import com.lojacrysleao.lojacrysleao_api.dto.verifyDTO.PasswordResetTokenDTO;
import com.lojacrysleao.lojacrysleao_api.mapper.verifyMapper.PasswordResetTokenMapper;
import com.lojacrysleao.lojacrysleao_api.model.user.User;
import com.lojacrysleao.lojacrysleao_api.model.verify.PasswordResetToken;
import com.lojacrysleao.lojacrysleao_api.repository.verifyRepository.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class PasswordResetTokenService {

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private PasswordResetTokenMapper passwordResetTokenMapper;

    /**
     * Cria um novo token de redefinição de senha para o usuário
     */
    public PasswordResetTokenDTO createPasswordResetToken(User user) {
        if (user == null) {
            throw new RuntimeException("Usuário não pode ser nulo");
        }

        // Remove tokens antigos do usuário se existirem
        passwordResetTokenRepository.deleteByUserId(user.getId());

        // Cria novo token
        PasswordResetToken token = new PasswordResetToken();
        token.setToken(UUID.randomUUID().toString());
        token.setUser(user);
        token.setExpiryDate(LocalDateTime.now().plusHours(24)); // Token válido por 24 horas

        PasswordResetToken savedToken = passwordResetTokenRepository.save(token);
        return passwordResetTokenMapper.toDTO(savedToken);
    }

    /**
     * Busca token de redefinição de senha pelo token string
     */
    public PasswordResetTokenDTO findByToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new RuntimeException("Token não pode ser nulo ou vazio");
        }

        Optional<PasswordResetToken> tokenEntity = passwordResetTokenRepository.findByToken(token);
        return tokenEntity.map(passwordResetTokenMapper::toDTO).orElse(null);
    }

    /**
     * Busca token de redefinição de senha pelo ID do usuário
     */
    public PasswordResetTokenDTO findByUserId(Long userId) {
        if (userId == null) {
            throw new RuntimeException("ID do usuário não pode ser nulo");
        }

        Optional<PasswordResetToken> tokenEntity = passwordResetTokenRepository.findByUserId(userId);
        return tokenEntity.map(passwordResetTokenMapper::toDTO).orElse(null);
    }

    /**
     * Valida se o token é válido (existe e não expirou)
     */
    public boolean isTokenValid(String token) {
        PasswordResetTokenDTO tokenDTO = findByToken(token);
        
        if (tokenDTO == null) {
            return false;
        }

        return tokenDTO.getExpiryDate().isAfter(LocalDateTime.now());
    }

    /**
     * Valida se o token é válido e retorna o DTO
     */
    public PasswordResetTokenDTO validateToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new RuntimeException("Token não pode ser nulo ou vazio");
        }

        PasswordResetTokenDTO tokenDTO = findByToken(token);
        
        if (tokenDTO == null) {
            throw new RuntimeException("Token não encontrado");
        }

        if (tokenDTO.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expirado");
        }

        return tokenDTO;
    }

    /**
     * Remove token após o uso (redefinição de senha concluída)
     */
    public void deleteToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new RuntimeException("Token não pode ser nulo ou vazio");
        }

        Optional<PasswordResetToken> tokenEntity = passwordResetTokenRepository.findByToken(token);
        if (tokenEntity.isPresent()) {
            passwordResetTokenRepository.delete(tokenEntity.get());
        }
    }

    /**
     * Remove todos os tokens de redefinição de senha de um usuário
     */
    public void deleteTokensByUserId(Long userId) {
        if (userId == null) {
            throw new RuntimeException("ID do usuário não pode ser nulo");
        }

        passwordResetTokenRepository.deleteByUserId(userId);
    }

    /**
     * Remove tokens expirados do banco de dados
     */
    public void deleteExpiredTokens() {
        // Busca todos os tokens e remove os expirados
        passwordResetTokenRepository.findAll().forEach(token -> {
            if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
                passwordResetTokenRepository.delete(token);
            }
        });
    }
}
