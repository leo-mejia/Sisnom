package com.sisnom.dto;

public class ApiResponse {
    private boolean success;
    private String mensaje;

    public ApiResponse(boolean success, String mensaje) {
        this.success = success;
        this.mensaje = mensaje;
    }

    public boolean isSuccess() { return success; }
    public String getMensaje() { return mensaje; }
}
