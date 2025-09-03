package com.lojacrysleao.lojacrysleao_api.repository.lojaRepository;

import com.lojacrysleao.lojacrysleao_api.model.loja.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByStatus(boolean status);
    
    // Métodos para trabalhar com subcategorias
    List<Category> findByParentId(Long parentId);
    
    List<Category> findByParentIdIsNull();
    
    List<Category> findByParentIdIsNullAndStatus(boolean status);
    
    // Métodos para categorias visíveis no header
    List<Category> findByShowInHeaderAndStatus(boolean showInHeader, boolean status);
}