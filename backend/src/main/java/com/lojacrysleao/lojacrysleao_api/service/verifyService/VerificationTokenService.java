package com.lojacrysleao.lojacrysleao_api.service.verifyService;

import com.lojacrysleao.lojacrysleao_api.dto.verifyDTO.VerificationTokenDTO;
import com.lojacrysleao.lojacrysleao_api.mapper.verifyMapper.VerificationTokenMapper;
import com.lojacrysleao.lojacrysleao_api.model.user.User;
import com.lojacrysleao.lojacrysleao_api.model.verify.VerificationToken;
import com.lojacrysleao.lojacrysleao_api.repository.verifyRepository.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class VerificationTokenService {

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Autowired
    private VerificationTokenMapper verificationTokenMapper;

    /**
     * Cria um novo token de verificação para o usuário
     */
    public VerificationTokenDTO createVerificationToken(User user) {
        if (user == null) {
            throw new RuntimeException("Usuário não pode ser nulo");
        }

        // Remove tokens antigos do usuário se existirem
        verificationTokenRepository.deleteByUserId(user.getId());

        // Cria novo token
        VerificationToken token = new VerificationToken();
        token.setToken(UUID.randomUUID().toString());
        token.setUser(user);
        token.setExpiryDate(LocalDateTime.now().plusHours(48)); // Token válido por 48 horas

        VerificationToken savedToken = verificationTokenRepository.save(token);
        return verificationTokenMapper.toDTO(savedToken);
    }

    /**
     * Busca token de verificação pelo token string
     */
    public VerificationTokenDTO findByToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new RuntimeException("Token não pode ser nulo ou vazio");
        }

        Optional<VerificationToken> tokenEntity = verificationTokenRepository.findByToken(token);
        return tokenEntity.map(verificationTokenMapper::toDTO).orElse(null);
    }

    /**
     * Busca token de verificação pelo ID do usuário
     */
    public VerificationTokenDTO findByUserId(Long userId) {
        if (userId == null) {
            throw new RuntimeException("ID do usuário não pode ser nulo");
        }

        Optional<VerificationToken> tokenEntity = verificationTokenRepository.findByUserId(userId);
        return tokenEntity.map(verificationTokenMapper::toDTO).orElse(null);
    }

    /**
     * Valida se o token é válido (existe e não expirou)
     */
    public boolean isTokenValid(String token) {
        VerificationTokenDTO tokenDTO = findByToken(token);
        
        if (tokenDTO == null) {
            return false;
        }

        return tokenDTO.getExpiryDate().isAfter(LocalDateTime.now());
    }

    /**
     * Valida se o token é válido e retorna o DTO
     */
    public VerificationTokenDTO validateToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new RuntimeException("Token não pode ser nulo ou vazio");
        }

        VerificationTokenDTO tokenDTO = findByToken(token);
        
        if (tokenDTO == null) {
            throw new RuntimeException("Token não encontrado");
        }

        if (tokenDTO.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expirado");
        }

        return tokenDTO;
    }

    /**
     * Remove token após o uso (verificação concluída)
     */
    public void deleteToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new RuntimeException("Token não pode ser nulo ou vazio");
        }

        Optional<VerificationToken> tokenEntity = verificationTokenRepository.findByToken(token);
        if (tokenEntity.isPresent()) {
            verificationTokenRepository.delete(tokenEntity.get());
        }
    }

    /**
     * Remove todos os tokens de verificação de um usuário
     */
    public void deleteTokensByUserId(Long userId) {
        if (userId == null) {
            throw new RuntimeException("ID do usuário não pode ser nulo");
        }

        verificationTokenRepository.deleteByUserId(userId);
    }

    /**
     * Remove tokens expirados do banco de dados
     */
    public void deleteExpiredTokens() {
        // Busca todos os tokens e remove os expirados
        verificationTokenRepository.findAll().forEach(token -> {
            if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
                verificationTokenRepository.delete(token);
            }
        });
    }

    /**
     * Regenera um token de verificação para um usuário
     */
    public VerificationTokenDTO regenerateToken(Long userId) {
        if (userId == null) {
            throw new RuntimeException("ID do usuário não pode ser nulo");
        }

        // Busca o token existente para obter o usuário
        Optional<VerificationToken> existingToken = verificationTokenRepository.findByUserId(userId);
        
        if (existingToken.isEmpty()) {
            throw new RuntimeException("Usuário não possui token de verificação");
        }

        User user = existingToken.get().getUser();
        
        // Remove o token antigo e cria um novo
        verificationTokenRepository.deleteByUserId(userId);
        return createVerificationToken(user);
    }
}
