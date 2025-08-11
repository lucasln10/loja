package com.lojacrysleao.lojacrysleao_api.service.lojaService;

import com.lojacrysleao.lojacrysleao_api.model.loja.Product;
import com.lojacrysleao.lojacrysleao_api.dto.lojaDTO.ProductDTO;
import com.lojacrysleao.lojacrysleao_api.repository.lojaRepository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import com.lojacrysleao.lojacrysleao_api.mapper.lojaMapper.ProductMapper;

class ProductServiceTest {
    @Mock
    private ProductRepository productRepository;
    @Mock
    private ProductMapper productMapper;
    @InjectMocks
    private ProductService productService;

    private Product product;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        product = new Product();
        product.setId(1L);
        product.setName("Produto Teste");
        product.setStatus(true);
        // Stubbing padrão para evitar NullPointer
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        ProductDTO dto = new ProductDTO();
        dto.setId(1L);
        dto.setName("Produto Teste");
        when(productMapper.toDTO(product)).thenReturn(dto);
    }

    @Test
    void testFindById() {
        ProductDTO found = productService.findById(1L);
        assertNotNull(found);
        assertEquals("Produto Teste", found.getName());
    }

    @Test
    void testEnableStatus() {
        product.setStatus(false); // garantir que está desabilitado
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        productService.enableStatus(1L);
        assertTrue(product.isStatus());
        verify(productRepository).save(product);
    }

    @Test
    void testDisableStatus() {
        product.setStatus(true); // garantir que está habilitado
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        productService.desableStatus(1L);
        assertFalse(product.isStatus());
        verify(productRepository).save(product);
    }
}
