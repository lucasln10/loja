package com.lojacrysleao.lojacrysleao_api.service.loginAndRegisterService;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import com.lojacrysleao.lojacrysleao_api.model.loja.Product;
import com.lojacrysleao.lojacrysleao_api.model.user.User;
import com.lojacrysleao.lojacrysleao_api.repository.lojaRepository.ProductRepository;
import com.lojacrysleao.lojacrysleao_api.repository.userRepository.UserRepository;
import com.lojacrysleao.lojacrysleao_api.service.userService.UserService;

class UserServiceTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private ProductRepository productRepository;
    @InjectMocks
    private UserService userService;

    private User user;
    private Product product;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User();
        user.setId(1L);
        user.setName("Teste");
        user.setEmail("teste@exemplo.com");
        user.setEnable(true);
        product = new Product();
        product.setId(10L);
        product.setName("Produto Teste");
    }

    @Test
    void testAddFavorite() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));
        userService.addFavorite(1L, 10L);
        assertTrue(user.getFavorites().stream().anyMatch(p -> p.getId().equals(10L)));
        verify(userRepository).save(user);
    }

    @Test
    void testRemoveFavorite() {
        user.addFavorite(product);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        userService.removeFavorite(1L, 10L);
        assertFalse(user.getFavorites().stream().anyMatch(p -> p.getId().equals(10L)));
        verify(userRepository).save(user);
    }

    @Test
    void testListFavorites() {
        user.addFavorite(product);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        Set<Product> favorites = userService.listFavorites(1L);
        assertEquals(1, favorites.size());
        assertTrue(favorites.stream().anyMatch(p -> p.getId().equals(10L)));
    }
}
