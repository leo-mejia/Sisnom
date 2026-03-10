package com.sisnom.service;

import com.sisnom.dto.ApiResponse;
import com.sisnom.dto.PerfilResponse;
import com.sisnom.dto.PerfilUpdateRequest;
import com.sisnom.model.Empleado;
import com.sisnom.repository.EmpleadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class PerfilService {

    @Autowired private EmpleadoRepository empleadoRepository;

    public PerfilResponse obtenerPerfil(String correo) {
        Optional<Empleado> opt = empleadoRepository.findByUsuarioCorreo(correo);
        PerfilResponse resp = new PerfilResponse();

        if (opt.isEmpty()) {
            resp.setSuccess(false);
            resp.setMensaje("Empleado no encontrado");
            return resp;
        }

        Empleado e = opt.get();
        
        // Verificar si el empleado está activo (manejar caso de estado null)
        if (e.getEstado() == null || e.getEstado() != Empleado.Estado.activo) {
            resp.setSuccess(false);
            resp.setMensaje("Empleado no activo");
            return resp;
        }
        
        resp.setSuccess(true);
        resp.setIdEmpleado(e.getIdEmpleado());
        resp.setNombres(e.getNombres());
        resp.setApellidos(e.getApellidos());
        resp.setCorreo(e.getCorreoPersonal());
        resp.setTelefono(e.getTelefono());
        resp.setDireccion(e.getDireccion());
        resp.setCargo(e.getCargo());
        resp.setDepartamento(e.getDepartamento());
        resp.setFechaInicio(e.getFechaInicio() != null ? e.getFechaInicio().toString() : "");
        resp.setRol(e.getUsuario().getRol().name());
        return resp;
    }

    @Transactional
    public ApiResponse actualizarPerfil(String correo, PerfilUpdateRequest request) {
        Optional<Empleado> opt = empleadoRepository.findByUsuarioCorreo(correo);
        if (opt.isEmpty()) return new ApiResponse(false, "Empleado no encontrado");

        Empleado e = opt.get();
        e.setNombres(request.getNombres());
        e.setApellidos(request.getApellidos());
        e.setCorreoPersonal(request.getCorreo());
        e.setTelefono(request.getTelefono());
        e.setDireccion(request.getDireccion());
        e.setCargo(request.getCargo());
        e.setDepartamento(request.getDepartamento());
        empleadoRepository.save(e);
        return new ApiResponse(true, "Perfil actualizado correctamente");
    }

    @Transactional
    public ApiResponse eliminarPerfil(String correo) {
        Optional<Empleado> opt = empleadoRepository.findByUsuarioCorreo(correo);
        if (opt.isEmpty()) return new ApiResponse(false, "Empleado no encontrado");

        Empleado e = opt.get();
        e.setEstado(Empleado.Estado.inactivo);
        empleadoRepository.save(e);
        return new ApiResponse(true, "Perfil eliminado correctamente");
    }
}
