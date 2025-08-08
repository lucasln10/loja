package com.lojacrysleao.lojacrysleao_api.mapper.lojaMapper;

import com.lojacrysleao.lojacrysleao_api.model.loja.Product;
import com.lojacrysleao.lojacrysleao_api.model.loja.ProductImage;
import com.lojacrysleao.lojacrysleao_api.model.loja.Category;
import com.lojacrysleao.lojacrysleao_api.dto.lojaDTO.ProductDTO;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductMapper {

    public ProductDTO toDTO(Product product) {
        if (product == null) {
            return null;
        }

        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setPrice(product.getPrice());
        dto.setQuantity(product.getQuantity());
        dto.setDescription(product.getDescription());
        dto.setDetailedDescription(product.getDetailedDescription());
        dto.setCategoryId(product.getCategory() != null ? product.getCategory().getId() : null);

        // Mapear as URLs das imagens
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            List<String> imageUrls = product.getImages().stream()
                    .map(ProductImage::getImageUrl)
                    .collect(Collectors.toList());
            dto.setImageUrls(imageUrls);
            //primeira imagem como imageUrl principal
            dto.setImageUrl(product.getPrimaryImageUrl());
        }

        return dto;
    }

    public Product toEntity(ProductDTO dto) {
        if (dto == null) {
            return null;
        }

        Product product = new Product();
        product.setId(dto.getId());
        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setQuantity(dto.getQuantity());
        product.setDescription(dto.getDescription());
        product.setDetailedDescription(dto.getDetailedDescription());
        
        return product;
    }

    public Product toEntity(ProductDTO dto, Category category) {
        Product product = toEntity(dto);
        product.setCategory(category);
        return product;
    }
}
