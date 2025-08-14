package com.lojacrysleao.lojacrysleao_api.dto.lojaDTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductSearchDTO {
    
    // Parâmetros de busca
    private String searchTerm;
    
    // Filtros
    private Long categoryId;
    private Double minPrice;
    private Double maxPrice;
    private Integer minStock;
    private Integer maxStock;
    private Boolean inStock; // true = apenas produtos com estoque > 0
    
    // Paginação
    private Integer page = 0;
    private Integer size = 20;
    
    // Ordenação
    private String sortBy = "name"; // name, price, createdAt
    private String sortDirection = "asc"; // asc, desc
    
    // Filtros adicionais
    private Boolean activeOnly = true; // apenas produtos ativos por padrão
}
