package com.sisnom.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Data
public class PerfilDTO {
    private Integer idEmpleado;
    @NotBlank private String nombres;
    @NotBlank private String apellidos;
    @Email private String correo;
    private String telefono;
    private String direccion;
    private String cargo;
    private String departamento;
    private String fechaInicio;
    private String rol;
}
