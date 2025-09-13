package com.lojacrysleao.lojacrysleao_api.mapper.lojaMapper;

import com.lojacrysleao.lojacrysleao_api.model.loja.Category;
import com.lojacrysleao.lojacrysleao_api.dto.lojaDTO.CategoryDTO;
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
        dto.setStatus(category.getStatus());
        
        // Mapear parentId para subcategorias
        if (category.getParent() != null) {
            dto.setParentId(category.getParent().getId());
        }
        
        // Mapear controle de visibilidade
        dto.setShowInHeader(category.isShowInHeader());
        
        // Mapear ordenação no header
        dto.setHeaderOrder(category.getHeaderOrder());

        return dto;
    }

    public Category toEntity(CategoryDTO dto) {
        if (dto == null) {
            return null;
        }

        Category category = new Category();
        category.setId(dto.getId());
        category.setName(dto.getName());
        if (dto.getStatus() != null) {
            category.setStatus(dto.getStatus());
        }
        
        // showInHeader será atualizado no service quando necessário
        if (dto.getShowInHeader() != null) {
            category.setShowInHeader(dto.getShowInHeader());
        }
        
        // headerOrder será atualizado no service quando necessário
        if (dto.getHeaderOrder() != null) {
            category.setHeaderOrder(dto.getHeaderOrder());
        }

        return category;
    }
    
    // Método para atualizar uma categoria existente
    public void updateEntityFromDTO(CategoryDTO dto, Category category) {
        if (dto.getName() != null) {
            category.setName(dto.getName());
        }
        
        if (dto.getStatus() != null) {
            category.setStatus(dto.getStatus());
        }
        
        if (dto.getShowInHeader() != null) {
            category.setShowInHeader(dto.getShowInHeader());
        }
        
        if (dto.getHeaderOrder() != null) {
            category.setHeaderOrder(dto.getHeaderOrder());
        }
        // parentId será tratado no service para evitar referências circulares
    }
}