package com.lojacrysleao.lojacrysleao_api.repository.lojaRepository;

import com.lojacrysleao.lojacrysleao_api.model.loja.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
