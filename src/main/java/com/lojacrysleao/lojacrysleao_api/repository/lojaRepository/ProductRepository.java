package com.lojacrysleao.lojacrysleao_api.repository.lojaRepository;

import com.lojacrysleao.lojacrysleao_api.model.loja.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
