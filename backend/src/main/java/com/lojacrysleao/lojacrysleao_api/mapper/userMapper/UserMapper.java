package com.lojacrysleao.lojacrysleao_api.mapper.userMapper;

import com.lojacrysleao.lojacrysleao_api.dto.authDTO.UserDTO;
import com.lojacrysleao.lojacrysleao_api.model.loja.Product;
import com.lojacrysleao.lojacrysleao_api.model.user.User;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    public UserDTO toDTO(User user) {
        return toDTO(user, true);
    }

    public UserDTO toDTO(User user, boolean includeFavorites) {
        if (user == null) return null;

        UserDTO dto = new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole() != null ? user.getRole().name() : null
        );

        if (includeFavorites) {
            Set<Long> favIds = user.getFavorites() == null ? null :
                    user.getFavorites().stream().map(Product::getId).collect(Collectors.toSet());
            dto.setFavoriteProductIds(favIds);
        }

        return dto;
    }
}
