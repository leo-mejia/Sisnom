package com.sisnom.dto;

public class LoginResponse {
    private String token;
    private String rol;
    private String correo;
    private String mensaje;

    public LoginResponse(String token, String rol, String correo, String mensaje) {
        this.token = token;
        this.rol = rol;
        this.correo = correo;
        this.mensaje = mensaje;
    }

    public String getToken() { return token; }
    public String getRol() { return rol; }
    public String getCorreo() { return correo; }
    public String getMensaje() { return mensaje; }
}
