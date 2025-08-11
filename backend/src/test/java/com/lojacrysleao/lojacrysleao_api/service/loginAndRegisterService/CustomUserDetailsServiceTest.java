package com.lojacrysleao.lojacrysleao_api.service.loginAndRegisterService;

import com.lojacrysleao.lojacrysleao_api.model.user.User;
import com.lojacrysleao.lojacrysleao_api.model.user.Role;
import com.lojacrysleao.lojacrysleao_api.repository.userRepository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CustomUserDetailsServiceTest {
    @Mock
    private UserRepository userRepository;
    private CustomUserDetailsService customUserDetailsService;
    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        customUserDetailsService = new CustomUserDetailsService(userRepository);
        user = new User();
        user.setEmail("teste@email.com");
        user.setPassword("senha");
        user.setRole(Role.USER);
    }

    @Test
    void testLoadUserByUsernameSuccess() {
        when(userRepository.findByEmail("teste@email.com")).thenReturn(Optional.of(user));
        UserDetails details = customUserDetailsService.loadUserByUsername("teste@email.com");
        assertEquals("teste@email.com", details.getUsername());
        assertEquals("senha", details.getPassword());
        assertTrue(details.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_USER")));
    }

    @Test
    void testLoadUserByUsernameNotFound() {
        when(userRepository.findByEmail("naoexiste@email.com")).thenReturn(Optional.empty());
        assertThrows(UsernameNotFoundException.class, () -> customUserDetailsService.loadUserByUsername("naoexiste@email.com"));
    }
}
