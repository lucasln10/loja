package com.lojacrysleao.lojacrysleao_api.repository;

import com.lojacrysleao.lojacrysleao_api.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
}
