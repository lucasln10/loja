package com.lojacrysleao.lojacrysleao_api.controller.storageController;

import com.lojacrysleao.lojacrysleao_api.dto.storageDTO.StorageDTO;
import com.lojacrysleao.lojacrysleao_api.controller.storageController.StorageController.UpdateStorageRequest;
import com.lojacrysleao.lojacrysleao_api.service.storageService.StorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class StorageControllerTest {
    @Mock private StorageService storageService;
    @InjectMocks private StorageController storageController;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(storageController).build();
    }

    @Test
    void testListAll() throws Exception {
        when(storageService.listAll()).thenReturn(java.util.Collections.emptyList());
        mockMvc.perform(get("/api/storage"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetByProduct() throws Exception {
        when(storageService.findByProductId(1L)).thenReturn(new StorageDTO());
        mockMvc.perform(get("/api/storage/product/1"))
                .andExpect(status().isOk());
    }

    @Test
    void testUpdateByProduct() throws Exception {
        when(storageService.updateByProductId(eq(1L), any(), any())).thenReturn(new StorageDTO());
        mockMvc.perform(put("/api/storage/product/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"quantity\":10,\"reservation\":2}"))
                .andExpect(status().isOk());
    }
}
