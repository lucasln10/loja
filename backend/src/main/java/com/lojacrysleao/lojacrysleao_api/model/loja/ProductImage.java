package com.lojacrysleao.lojacrysleao_api.model.loja;

import jakarta.persistence.*;

@Entity
@Table(name = "product_images")
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String imageUrl;

    @Column(nullable = false)
    private String filename;

    @Column(nullable = false)
    private boolean isPrimary = false; // Para definir qual é a imagem principal

    @Column(nullable = false)
    private int displayOrder = 0; // Para ordenar as imagens

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // Construtores
    public ProductImage() {}

    public ProductImage(String imageUrl, String filename, Product product) {
        this.imageUrl = imageUrl;
        this.filename = filename;
        this.product = product;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public boolean isPrimary() {
        return isPrimary;
    }

    public void setPrimary(boolean primary) {
        isPrimary = primary;
    }

    public int getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(int displayOrder) {
        this.displayOrder = displayOrder;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}
