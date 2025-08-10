package com.lojacrysleao.lojacrysleao_api.dto.lojaDTO;

import com.lojacrysleao.lojacrysleao_api.model.loja.ProductImage;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.ArrayList;

@Setter
@Getter
public class ProductDTO {

    private Long id;

    private String name;

    private double price;

    private int quantity;

    private String description;

    private String detailedDescription;

    private Long categoryId;

    private boolean status;

    private String imageUrl;

    private List<String> imageUrls = new ArrayList<>();

}
