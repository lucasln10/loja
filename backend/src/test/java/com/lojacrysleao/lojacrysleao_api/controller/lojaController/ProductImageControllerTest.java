package com.lojacrysleao.lojacrysleao_api.controller.lojaController;

import com.lojacrysleao.lojacrysleao_api.model.loja.Product;
import com.lojacrysleao.lojacrysleao_api.model.loja.ProductImage;
import com.lojacrysleao.lojacrysleao_api.repository.lojaRepository.ProductImageRepository;
import com.lojacrysleao.lojacrysleao_api.repository.lojaRepository.ProductRepository;
import com.lojacrysleao.lojacrysleao_api.service.uploadService.ImageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import java.util.Collections;
import java.util.Optional;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ProductImageControllerTest {
    @Mock private ImageService imageService;
    @Mock private ProductRepository productRepository;
    @Mock private ProductImageRepository productImageRepository;
    @InjectMocks private ProductImageController controller;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void testGetProductImages() throws Exception {
        ProductImage img = new ProductImage("/api/products/images/a.png","a.png", new Product());
        when(productImageRepository.findByProductIdOrderByDisplayOrder(1L)).thenReturn(Collections.singletonList(img));
        mockMvc.perform(get("/api/products/images/product/1"))
                .andExpect(status().isOk());
    }

    @Test
    void testUploadImage() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file","a.png","image/png","x".getBytes());
        when(imageService.uploadImage(any())).thenReturn("a.png");
        mockMvc.perform(multipart("/api/products/images/upload").file(file))
                .andExpect(status().isOk());
    }
}
