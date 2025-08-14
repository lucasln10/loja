package com.lojacrysleao.lojacrysleao_api.service.lojaService;

import com.lojacrysleao.lojacrysleao_api.dto.lojaDTO.ProductSearchDTO;
import com.lojacrysleao.lojacrysleao_api.dto.common.PageResponseDTO;
import com.lojacrysleao.lojacrysleao_api.dto.lojaDTO.ProductDTO;
import com.lojacrysleao.lojacrysleao_api.model.loja.Product;
import com.lojacrysleao.lojacrysleao_api.model.loja.Category;
import com.lojacrysleao.lojacrysleao_api.repository.lojaRepository.ProductRepository;
import com.lojacrysleao.lojacrysleao_api.repository.lojaRepository.CategoryRepository;
import com.lojacrysleao.lojacrysleao_api.mapper.lojaMapper.ProductMapper;
import com.lojacrysleao.lojacrysleao_api.exception.BadRequestException;
import com.lojacrysleao.lojacrysleao_api.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductSearchServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ProductMapper productMapper;

    @InjectMocks
    private ProductService productService;

    private Product product;
    private ProductDTO productDTO;
    private Category category;
    private ProductSearchDTO searchDTO;

    @BeforeEach
    void setUp() {
        category = new Category();
        category.setId(1L);
        category.setName("Eletrônicos");

        product = new Product();
        product.setId(1L);
        product.setName("Smartphone Teste");
        product.setPrice(599.99);
        product.setQuantity(10);
        product.setStatus(true);
        product.setCategory(category);

        productDTO = new ProductDTO();
        productDTO.setId(1L);
        productDTO.setName("Smartphone Teste");
        productDTO.setPrice(599.99);
        productDTO.setQuantity(10);
        productDTO.setStatus(true);
        productDTO.setCategoryId(1L);

        searchDTO = new ProductSearchDTO();
        searchDTO.setSearchTerm("smartphone");
        searchDTO.setPage(0);
        searchDTO.setSize(20);
        searchDTO.setSortBy("name");
        searchDTO.setSortDirection("asc");
        searchDTO.setActiveOnly(true);
    }

    @Test
    void testSearchProducts() {
        // Arrange
        Page<Product> productPage = new PageImpl<>(Arrays.asList(product), PageRequest.of(0, 20), 1);
        when(productRepository.findByAdvancedFilters(any(), any(), any(), any(), any(), any(), any(), any(Pageable.class)))
                .thenReturn(productPage);
        when(productMapper.toDTO(any(Product.class))).thenReturn(productDTO);

        // Act
        PageResponseDTO<ProductDTO> result = productService.searchProducts(searchDTO);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(0, result.getPageNumber());
        assertEquals(20, result.getPageSize());
        assertEquals(1, result.getTotalElements());
        verify(productRepository).findByAdvancedFilters(
                eq(true), eq(null), eq(null), eq(null), eq(null), eq(null), eq("smartphone"), any(Pageable.class)
        );
    }

    @Test
    void testSearchByTerm() {
        // Arrange
        Page<Product> productPage = new PageImpl<>(Arrays.asList(product));
        when(productRepository.findBySearchTermAndStatus(eq("smartphone"), eq(true), any(Pageable.class)))
                .thenReturn(productPage);
        when(productMapper.toDTO(any(Product.class))).thenReturn(productDTO);

        // Act
        PageResponseDTO<ProductDTO> result = productService.searchByTerm("smartphone", 0, 20);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(productRepository).findBySearchTermAndStatus(eq("smartphone"), eq(true), any(Pageable.class));
    }

    @Test
    void testFilterByCategory() {
        // Arrange
        when(categoryRepository.findById(eq(1L))).thenReturn(Optional.of(category));
        Page<Product> productPage = new PageImpl<>(Arrays.asList(product));
        when(productRepository.findByCategoryIdAndStatus(eq(1L), eq(true), any(Pageable.class)))
                .thenReturn(productPage);
        when(productMapper.toDTO(any(Product.class))).thenReturn(productDTO);

        // Act
        PageResponseDTO<ProductDTO> result = productService.filterByCategory(1L, 0, 20);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(categoryRepository).findById(eq(1L));
        verify(productRepository).findByCategoryIdAndStatus(eq(1L), eq(true), any(Pageable.class));
    }

    @Test
    void testFilterByPriceRange() {
        // Arrange
        Page<Product> productPage = new PageImpl<>(Arrays.asList(product));
        when(productRepository.findByPriceBetweenAndStatus(eq(100.0), eq(1000.0), eq(true), any(Pageable.class)))
                .thenReturn(productPage);
        when(productMapper.toDTO(any(Product.class))).thenReturn(productDTO);

        // Act
        PageResponseDTO<ProductDTO> result = productService.filterByPriceRange(100.0, 1000.0, 0, 20);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(productRepository).findByPriceBetweenAndStatus(eq(100.0), eq(1000.0), eq(true), any(Pageable.class));
    }

    @Test
    void testFilterByStock() {
        // Arrange
        Page<Product> productPage = new PageImpl<>(Arrays.asList(product));
        when(productRepository.findByQuantityGreaterThanAndStatus(eq(5), eq(true), any(Pageable.class)))
                .thenReturn(productPage);
        when(productMapper.toDTO(any(Product.class))).thenReturn(productDTO);

        // Act
        PageResponseDTO<ProductDTO> result = productService.filterByStock(5, 0, 20);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(productRepository).findByQuantityGreaterThanAndStatus(eq(5), eq(true), any(Pageable.class));
    }

    @Test
    void testSearchProductsWithInvalidParams() {
        // Arrange
        searchDTO.setPage(-1);

        // Act & Assert
        assertThrows(BadRequestException.class, () -> productService.searchProducts(searchDTO));
    }

    @Test
    void testSearchByTermWithEmptyTerm() {
        // Act & Assert
        assertThrows(BadRequestException.class, () -> productService.searchByTerm("", 0, 20));
        assertThrows(BadRequestException.class, () -> productService.searchByTerm(null, 0, 20));
    }

    @Test
    void testFilterByCategoryWithInvalidId() {
        // Arrange
        when(categoryRepository.findById(eq(999L))).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> productService.filterByCategory(999L, 0, 20));
    }

    @Test
    void testFilterByPriceRangeWithInvalidRange() {
        // Act & Assert
        assertThrows(BadRequestException.class, () -> productService.filterByPriceRange(1000.0, 100.0, 0, 20));
    }

    @Test
    void testFilterByStockWithInvalidStock() {
        // Act & Assert
        assertThrows(BadRequestException.class, () -> productService.filterByStock(-1, 0, 20));
        assertThrows(BadRequestException.class, () -> productService.searchByTerm(null, 0, 20));
    }
}
