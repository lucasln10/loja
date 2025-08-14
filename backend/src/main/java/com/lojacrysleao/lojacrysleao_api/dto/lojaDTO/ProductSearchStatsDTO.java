package com.lojacrysleao.lojacrysleao_api.dto.lojaDTO;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductSearchStatsDTO {
    
    private Long totalProducts;
    private Double minPrice;
    private Double maxPrice;
    private Integer minStock;
    private Integer maxStock;
    private List<CategoryCountDTO> categories;
    
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CategoryCountDTO {
        private Long categoryId;
        private String categoryName;
        private Long productCount;
    }
}
