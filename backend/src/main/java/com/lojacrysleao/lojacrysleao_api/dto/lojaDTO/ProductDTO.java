package com.lojacrysleao.lojacrysleao_api.dto.lojaDTO;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.ArrayList;
import java.util.Set;

@Setter
@Getter
public class ProductDTO {

    private Long id;

    private String name;

    private double price;

    private int quantity;

    private String description;

    private String detailedDescription;

    // Categoria principal (mantido para compatibilidade)
    private Long categoryId;

    // Múltiplas categorias (novo)
    private Set<Long> categoryIds;

    private boolean status;

    private String imageUrl;

    private List<String> imageUrls = new ArrayList<>();

}