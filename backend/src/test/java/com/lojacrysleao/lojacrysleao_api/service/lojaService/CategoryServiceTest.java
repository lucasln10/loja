package com.lojacrysleao.lojacrysleao_api.service.lojaService;

import com.lojacrysleao.lojacrysleao_api.dto.lojaDTO.CategoryDTO;
import com.lojacrysleao.lojacrysleao_api.exception.BadRequestException;
import com.lojacrysleao.lojacrysleao_api.exception.ResourceNotFoundException;
import com.lojacrysleao.lojacrysleao_api.mapper.lojaMapper.CategoryMapper;
import com.lojacrysleao.lojacrysleao_api.model.loja.Category;
import com.lojacrysleao.lojacrysleao_api.repository.lojaRepository.CategoryRepository;
import com.lojacrysleao.lojacrysleao_api.repository.lojaRepository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.Optional;
import java.util.Collections;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CategoryServiceTest {
    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private CategoryMapper categoryMapper;
    @Mock
    private ProductRepository productRepository;
    @InjectMocks
    private CategoryService categoryService;
    private Category category;
    private CategoryDTO categoryDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        category = new Category();
        category.setId(1L);
        category.setName("Categoria Teste");
        categoryDTO = new CategoryDTO();
        categoryDTO.setId(1L);
        categoryDTO.setName("Categoria Teste");
        when(categoryMapper.toEntity(categoryDTO)).thenReturn(category);
        when(categoryMapper.toDTO(category)).thenReturn(categoryDTO);
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(categoryRepository.save(any(Category.class))).thenReturn(category);
        when(categoryRepository.findAll()).thenReturn(Collections.singletonList(category));
    }

    @Test
    void testCreateCategory() {
        CategoryDTO created = categoryService.create(categoryDTO);
        assertNotNull(created);
        assertEquals("Categoria Teste", created.getName());
    }

    @Test
    void testCreateCategoryNullDto() {
        assertThrows(BadRequestException.class, () -> categoryService.create(null));
    }

    @Test
    void testListAll() {
        List<CategoryDTO> list = categoryService.listAll();
        assertEquals(1, list.size());
        assertEquals("Categoria Teste", list.get(0).getName());
    }

    @Test
    void testFindById() {
        CategoryDTO found = categoryService.findById(1L);
        assertNotNull(found);
        assertEquals(1L, found.getId());
    }

    @Test
    void testFindByIdNull() {
        assertThrows(BadRequestException.class, () -> categoryService.findById(null));
    }

    @Test
    void testFindByIdNotFound() {
        when(categoryRepository.findById(2L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> categoryService.findById(2L));
    }
}
