package com.lojacrysleao.lojacrysleao_api.mapper.verifyMapper;

import com.lojacrysleao.lojacrysleao_api.dto.verifyDTO.PasswordResetTokenDTO;
import com.lojacrysleao.lojacrysleao_api.model.verify.PasswordResetToken;
import org.springframework.stereotype.Component;

@Component
public class PasswordResetTokenMapper {

    public PasswordResetTokenDTO toDTO(PasswordResetToken passwordResetToken) {
        if (passwordResetToken == null){
            return null;
        }

        PasswordResetTokenDTO dto = new PasswordResetTokenDTO();
        dto.setId(passwordResetToken.getId());
        dto.setToken(passwordResetToken.getToken());
        dto.setUserId(passwordResetToken.getUser() != null ? passwordResetToken.getUser().getId() : null);
        dto.setUserEmail(passwordResetToken.getUser() != null ? passwordResetToken.getUser().getEmail() : null);
        dto.setExpiryDate(passwordResetToken.getExpiryDate());

        return dto;
    }

    public PasswordResetToken toEntity(PasswordResetTokenDTO dto) {
        if (dto == null){
            return null;
        }

        PasswordResetToken passwordResetToken = new PasswordResetToken();
        passwordResetToken.setId(dto.getId());
        passwordResetToken.setToken(dto.getToken());
        // Nota: A entidade User deve ser definida separadamente no service
        passwordResetToken.setExpiryDate(dto.getExpiryDate());

        return passwordResetToken;
    }
}
