package com.lojacrysleao.lojacrysleao_api.dto.authDTO;

public class UserDTO {

    private Long id;

    private String name;

    private String email;

    private String phone;

    private String cpf;

    private String password;

    private String role;

    // Set of product IDs that the user has favorited
    private java.util.Set<Long> favoriteProductIds;

    // Default constructor
    public UserDTO() {
    }

    // Constructor with parameters
    public UserDTO(Long id, String name, String email, String role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public java.util.Set<Long> getFavoriteProductIds() {
        return favoriteProductIds;
    }

    public void setFavoriteProductIds(java.util.Set<Long> favoriteProductIds) {
        this.favoriteProductIds = favoriteProductIds;
    }
}
