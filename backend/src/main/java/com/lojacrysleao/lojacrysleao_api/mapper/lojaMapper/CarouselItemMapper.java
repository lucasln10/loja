package com.lojacrysleao.lojacrysleao_api.mapper.lojaMapper;

import com.lojacrysleao.lojacrysleao_api.dto.lojaDTO.CarouselItemDTO;
import com.lojacrysleao.lojacrysleao_api.model.loja.CarouselItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CarouselItemMapper {
    
    @Autowired
    private ProductMapper productMapper;
    
    public CarouselItemDTO toDTO(CarouselItem carouselItem) {
        if (carouselItem == null) {
            return null;
        }
        
        CarouselItemDTO dto = new CarouselItemDTO();
        dto.setId(carouselItem.getId());
        dto.setTitle(carouselItem.getTitle());
        dto.setDescription(carouselItem.getDescription());
        dto.setImageUrl(carouselItem.getImageUrl());
        dto.setCarouselType(carouselItem.getCarouselType());
        dto.setActive(carouselItem.getActive());
        dto.setDisplayOrder(carouselItem.getDisplayOrder());
        dto.setLinkUrl(carouselItem.getLinkUrl());
        
        if (carouselItem.getProduct() != null) {
            dto.setProductId(carouselItem.getProduct().getId());
            dto.setProduct(productMapper.toDTO(carouselItem.getProduct()));
        }
        
        return dto;
    }
    
    public CarouselItem toEntity(CarouselItemDTO dto) {
        if (dto == null) {
            return null;
        }
        
        CarouselItem entity = new CarouselItem();
        entity.setId(dto.getId());
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setImageUrl(dto.getImageUrl());
        entity.setCarouselType(dto.getCarouselType());
        entity.setActive(dto.getActive());
        entity.setDisplayOrder(dto.getDisplayOrder());
        entity.setLinkUrl(dto.getLinkUrl());
        
        // Produto será definido no service
        
        return entity;
    }
}
