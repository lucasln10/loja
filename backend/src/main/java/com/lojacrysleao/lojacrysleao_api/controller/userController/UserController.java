package com.lojacrysleao.lojacrysleao_api.controller.userController;

import com.lojacrysleao.lojacrysleao_api.dto.authDTO.UserDTO;
import com.lojacrysleao.lojacrysleao_api.model.loja.Product;
import com.lojacrysleao.lojacrysleao_api.service.loginAndRegisterService.AuthService;
import com.lojacrysleao.lojacrysleao_api.service.loginAndRegisterService.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    private Long getCurrentUserId() {
        UserDTO user = authService.getCurrentUser();
        return user.getId();
    }

    @GetMapping("/favorites")
    public ResponseEntity<Set<Long>> listFavorites() {
        Long userId = getCurrentUserId();
        Set<Product> favorites = userService.listFavorites(userId);
        Set<Long> ids = favorites.stream().map(Product::getId).collect(Collectors.toSet());
        return ResponseEntity.ok(ids);
    }

    @PostMapping("/favorites/{productId}")
    public ResponseEntity<Void> addFavorite(@PathVariable Long productId) {
        Long userId = getCurrentUserId();
        userService.addFavorite(userId, productId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/favorites/{productId}")
    public ResponseEntity<Void> removeFavorite(@PathVariable Long productId) {
        Long userId = getCurrentUserId();
        userService.removeFavorite(userId, productId);
        return ResponseEntity.noContent().build();
    }
}
