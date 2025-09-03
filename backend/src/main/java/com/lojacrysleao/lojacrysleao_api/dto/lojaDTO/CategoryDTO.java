package com.lojacrysleao.lojacrysleao_api.dto.lojaDTO;

public class CategoryDTO {

    private Long id;
    private String name;
    private Boolean status;
    private Long parentId; // Para suportar subcategorias
    private Boolean showInHeader; // Controle de visibilidade no header

    // Getters e Setters
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

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public Boolean getShowInHeader() {
        return showInHeader;
    }

    public void setShowInHeader(Boolean showInHeader) {
        this.showInHeader = showInHeader;
    }
}