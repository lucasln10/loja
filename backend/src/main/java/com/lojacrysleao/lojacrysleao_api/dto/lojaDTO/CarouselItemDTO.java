package com.lojacrysleao.lojacrysleao_api.dto.lojaDTO;

import com.lojacrysleao.lojacrysleao_api.model.loja.CarouselType;

public class CarouselItemDTO {
    
    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private CarouselType carouselType;
    private Long productId;
    private ProductDTO product;
    private Boolean active;
    private Integer displayOrder;
    private String linkUrl;
    
    // Construtores
    public CarouselItemDTO() {}
    
    public CarouselItemDTO(String title, String imageUrl, CarouselType carouselType) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.carouselType = carouselType;
        this.active = true;
    }
    
    // Getters e Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public CarouselType getCarouselType() {
        return carouselType;
    }
    
    public void setCarouselType(CarouselType carouselType) {
        this.carouselType = carouselType;
    }
    
    public Long getProductId() {
        return productId;
    }
    
    public void setProductId(Long productId) {
        this.productId = productId;
    }
    
    public ProductDTO getProduct() {
        return product;
    }
    
    public void setProduct(ProductDTO product) {
        this.product = product;
    }
    
    public Boolean getActive() {
        return active;
    }
    
    public void setActive(Boolean active) {
        this.active = active;
    }
    
    public Integer getDisplayOrder() {
        return displayOrder;
    }
    
    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
    
    public String getLinkUrl() {
        return linkUrl;
    }
    
    public void setLinkUrl(String linkUrl) {
        this.linkUrl = linkUrl;
    }
}
