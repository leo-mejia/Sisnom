package com.sisnom.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class AuthDTO {

    @Data
    public static class LoginRequest {
        @Email
        @NotBlank
        private String email;
        @NotBlank
        private String password;
    }

    @Data
    public static class LoginResponse {
        private String token;
        private String rol;
        private String email;

        public LoginResponse(String token, String rol, String email) {
            this.token = token;
            this.rol = rol;
            this.email = email;
        }
    }

    @Data
    public static class RegistroRequest {
        @NotBlank private String nombres;
        @NotBlank private String apellidos;
        @Email @NotBlank private String email;
        @NotBlank private String password;
        @NotBlank private String rol;
        @NotBlank private String tipoDoc;
        @NotBlank private String numeroDoc;
        private String telefono;
        private String direccion;
        @NotBlank private String cargo;
        private String fechaInicio;
        @NotBlank private String departamento;
    }
}
