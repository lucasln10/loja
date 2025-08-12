package com.lojacrysleao.lojacrysleao_api.controller.adminController;

import com.lojacrysleao.lojacrysleao_api.dto.authDTO.UserDTO;
import com.lojacrysleao.lojacrysleao_api.service.adminService.AdminService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import java.util.Collections;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class AdminControllerTest {
    @Mock private AdminService adminService;
    @InjectMocks private AdminController adminController;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(adminController).build();
    }

    @Test
    void testPromote() throws Exception {
        doNothing().when(adminService).promoteUserToAdmin(1L);
        mockMvc.perform(post("/api/admin/promote/1"))
                .andExpect(status().isOk());
    }

    @Test
    void testDemote() throws Exception {
        doNothing().when(adminService).demoteUserToUser(1L);
        mockMvc.perform(post("/api/admin/demote/1"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetAllUsers() throws Exception {
        when(adminService.getAllUsers()).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isOk());
    }
}
