package com.lojacrysleao.lojacrysleao_api.mapper.verifyMapper;

import com.lojacrysleao.lojacrysleao_api.dto.verifyDTO.VerificationTokenDTO;
import com.lojacrysleao.lojacrysleao_api.model.verify.VerificationToken;
import org.springframework.stereotype.Component;

@Component
public class VerificationTokenMapper {

    public VerificationTokenDTO toDTO(VerificationToken verify) {
        if (verify == null){
            return null;
        }

        VerificationTokenDTO dto = new VerificationTokenDTO();
        dto.setId(verify.getId());
        dto.setToken(verify.getToken());
        dto.setUserId(verify.getUser() != null ? verify.getUser().getId() : null);
        dto.setUserEmail(verify.getUser() != null ? verify.getUser().getEmail() : null);
        dto.setExpiryDate(verify.getExpiryDate());

        return dto;
    }

    public VerificationToken toEntity(VerificationTokenDTO dto) {
        if (dto == null){
            return null;
        }

        VerificationToken verify = new VerificationToken();
        verify.setId(dto.getId());
        verify.setToken(dto.getToken());
        // Nota: A entidade User deve ser definida separadamente no service
        verify.setExpiryDate(dto.getExpiryDate());

        return verify;
    }
}
