package com.lojacrysleao.lojacrysleao_api.service.lojaService;


import java.util.List;
import java.util.stream.Collectors;

import com.lojacrysleao.lojacrysleao_api.mapper.lojaMapper.CategoryMapper;
import com.lojacrysleao.lojacrysleao_api.model.loja.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lojacrysleao.lojacrysleao_api.dto.lojaDTO.CategoryDTO;
import com.lojacrysleao.lojacrysleao_api.repository.lojaRepository.CategoryRepository;
import com.lojacrysleao.lojacrysleao_api.repository.lojaRepository.ProductRepository;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CategoryMapper categoryMapper;

    @Autowired
    private ProductRepository productRepository;

    public CategoryDTO create(CategoryDTO dto) {
        if (dto == null) {
            throw new RuntimeException("CategoryDTO nao pode ser nulo");
        }
        Category category = categoryMapper.toEntity(dto);
        Category saved = categoryRepository.save(category);
        return categoryMapper.toDTO(saved);
    }

    public List<CategoryDTO> listAll() {
        return  categoryRepository.findAll()
                .stream()
                .map(categoryMapper::toDTO)
                .collect(Collectors.toList());
    }

    public CategoryDTO findById(Long id) {
        if (id == null) {
            throw new RuntimeException("ID nao pode ser nulo");
        }
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria nao encontrado."));
        return categoryMapper.toDTO(category);
    }

    public CategoryDTO update(CategoryDTO dto) {
        if (dto == null || dto.getId() == null) {
            throw new RuntimeException("CategoryDTO ou ID nao podem ser nulos.");
        }

        categoryRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Categoria nao encontrado."));

        Category category = categoryMapper.toEntity(dto);
        Category saved = categoryRepository.save(category);
        return categoryMapper.toDTO(saved);
    }

    public void delete(Long id) {
        if (id == null) {
            throw new RuntimeException("ID nao pode ser nulo.");
        }
        
        findById(id);

        // Verifica produtos vinclados a eta categoria
        boolean hasProducts = productRepository.findAll()
                .stream()
                .anyMatch(product -> product.getCategory() != null && 
                         product.getCategory().getId().equals(id));
        
        if (hasProducts) {
            throw new RuntimeException("Nao e possivel deletar categoria com produtos vinculados.");
        }
        
        categoryRepository.deleteById(id);
    }


}
