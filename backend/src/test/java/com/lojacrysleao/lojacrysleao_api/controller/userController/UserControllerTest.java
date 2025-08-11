package com.lojacrysleao.lojacrysleao_api.controller.userController;

import com.lojacrysleao.lojacrysleao_api.service.userService.UserService;
import com.lojacrysleao.lojacrysleao_api.service.loginAndRegisterService.AuthService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class UserControllerTest {
    @Mock
    private UserService userService;
    @Mock
    private AuthService authService;
    @InjectMocks
    private UserController userController;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = org.springframework.test.web.servlet.setup.MockMvcBuilders.standaloneSetup(userController).build();
    }

    @Test
    void testListFavorites() throws Exception {
        // Stubbing para evitar NullPointer
        com.lojacrysleao.lojacrysleao_api.dto.authDTO.UserDTO userDTO = new com.lojacrysleao.lojacrysleao_api.dto.authDTO.UserDTO();
        userDTO.setId(1L);
        when(authService.getCurrentUser()).thenReturn(userDTO);
        when(userService.listFavorites(1L)).thenReturn(java.util.Collections.emptySet());
        mockMvc.perform(get("/api/user/favorites"))
                .andExpect(status().isOk());
    }
}
