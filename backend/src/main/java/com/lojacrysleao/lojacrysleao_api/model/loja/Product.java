package com.lojacrysleao.lojacrysleao_api.model.loja;

import com.lojacrysleao.lojacrysleao_api.model.storage.Storage;
import com.lojacrysleao.lojacrysleao_api.model.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.ArrayList;
import java.util.Set;

@Setter
@Getter
@Entity
@Table(name = "produtos")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private double price;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = true)
    private String description;

    @Column(nullable = true, length = 2000)
    private String detailedDescription;

    // Relacionamento com categoria principal (mantido para compatibilidade)
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    // Relacionamento N:N com categorias (novo)
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "product_category",
        joinColumns = @JoinColumn(name = "product_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categories = new HashSet<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<ProductImage> images = new ArrayList<>();

    @OneToOne(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private Storage storage;

    private boolean status = false;

    @ManyToMany(mappedBy = "favorites")
    private Set<User> favoredBy = new HashSet<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Set<User> getFavoredBy() {
        return favoredBy;
    }

    // Método helper para obter a imagem principal
    public String getPrimaryImageUrl() {
        return images.stream()
                .filter(ProductImage::isPrimary)
                .findFirst()
                .map(ProductImage::getImageUrl)
                .orElse(images.isEmpty() ? null : images.get(0).getImageUrl());
    }
}