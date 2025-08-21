package com.lojacrysleao.lojacrysleao_api.model.loja;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "category")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @OneToMany(mappedBy = "category")
    private List<Product> produtos;
    @Column(nullable = false)
    private boolean status = false;

    public List<Product> getProdutos() {
        return produtos;
    }
    public void setProdutos(List<Product> produtos) {
        this.produtos = produtos;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public boolean getStatus() {
        return isActive;
    }
    public void setStatus(boolean isActive) {
        this.isActive = isActive;
    }

}

