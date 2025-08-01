    package com.lojacrysleao.lojacrysleao_api.dto.authDTO;

    public class LoginResponse {

        private String token;
        private Long id;
        private String name;
        private String email;
        private String role;

        // Construtor padrão
        public LoginResponse() {
        }

        // Construtor com apenas token
        public LoginResponse(String token) {
            this.token = token;
        }

        // Construtor completo
        public LoginResponse(String token, Long id, String name, String email, String role) {
            this.token = token;
            this.id = id;
            this.name = name;
            this.email = email;
            this.role = role;
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
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
    }
