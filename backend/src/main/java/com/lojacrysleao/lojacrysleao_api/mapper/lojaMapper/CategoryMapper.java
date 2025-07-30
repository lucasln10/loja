package com.lojacrysleao.lojacrysleao_api.mapper;

import com.lojacrysleao.lojacrysleao_api.model.loja.Category;
import com.lojacrysleao.lojacrysleao_api.model.loja.Product;
import com.lojacrysleao.lojacrysleao_api.dto.lojaDTO.CategoryDTO;
import com.lojacrysleao.lojacrysleao_api.dto.lojaDTO.ProductDTO;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public CategoryDTO toDTO(Category category) {
        if (category == null) {
            return null;
        }

        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());

        return dto;
    }

    public Category toEntity(CategoryDTO dto) {
        if (dto == null) {
            return null;
        }

        Category category = new Category();
        category.setId(dto.getId());
        category.setName(dto.getName());

        return category;
    }
}
