package com.lojacrysleao.lojacrysleao_api.controller.lojaController;

import com.lojacrysleao.lojacrysleao_api.dto.lojaDTO.CategoryDTO;
import com.lojacrysleao.lojacrysleao_api.service.lojaService.CategoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import java.util.Collections;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class CategoryControllerTest {
    @Mock
    private CategoryService categoryService;
    @InjectMocks
    private CategoryController categoryController;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(categoryController).build();
    }

    @Test
    void testGetAllCategories() throws Exception {
        when(categoryService.listAll()).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetCategoryById() throws Exception {
        when(categoryService.findById(1L)).thenReturn(new CategoryDTO());
        mockMvc.perform(get("/api/categories/1"))
                .andExpect(status().isOk());
    }
}
