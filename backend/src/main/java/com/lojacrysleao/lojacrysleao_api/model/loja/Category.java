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
    
    // Relacionamento hierárquico para subcategorias
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Category parent;
    
    // Subcategorias desta categoria
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Category> subcategories;
    
    // Controle de visibilidade no header
    @Column(name = "show_in_header", nullable = false)
    private boolean showInHeader = false;
    
    // Campo para ordenação das categorias no header
    @Column(name = "header_order", nullable = false)
    private int headerOrder = 0;

    // Getters e Setters
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
        return status;
    }
    
    public void setStatus(boolean status) {
        this.status = status;
    }
    
    public Category getParent() {
        return parent;
    }
    
    public void setParent(Category parent) {
        this.parent = parent;
    }
    
    public List<Category> getSubcategories() {
        return subcategories;
    }
    
    public void setSubcategories(List<Category> subcategories) {
        this.subcategories = subcategories;
    }
    
    public boolean isShowInHeader() {
        return showInHeader;
    }
    
    public void setShowInHeader(boolean showInHeader) {
        this.showInHeader = showInHeader;
    }
    
    public int getHeaderOrder() {
        return headerOrder;
    }
    
    public void setHeaderOrder(int headerOrder) {
        this.headerOrder = headerOrder;
    }
}