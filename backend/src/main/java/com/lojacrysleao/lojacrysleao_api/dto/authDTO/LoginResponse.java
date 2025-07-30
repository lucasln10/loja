    package com.lojacrysleao.lojacrysleao_api.dto.authDTO;

    public class LoginResponse {

        private String accessToken;
        private UserDTO user;

        // Construtor padrão
        public LoginResponse() {
        }

        // Construtor com apenas token
        public LoginResponse(String accessToken) {
            this.accessToken = accessToken;
        }

        // Construtor completo
        public LoginResponse(String accessToken, Long id, String name, String email, String role) {
            this.accessToken = accessToken;
            this.user = new UserDTO(id, name, email, role);
        }

        public String getAccessToken() {
            return accessToken;
        }

        public void setAccessToken(String accessToken) {
            this.accessToken = accessToken;
        }

        public UserDTO getUser() {
            return user;
        }

        public void setUser(UserDTO user) {
            this.user = user;
        }
    }
