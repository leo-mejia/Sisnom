package com.sisnom.service;

import com.sisnom.dto.*;
import com.sisnom.model.Empleado;
import com.sisnom.model.Usuario;
import com.sisnom.repository.EmpleadoRepository;
import com.sisnom.repository.UsuarioRepository;
import com.sisnom.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthService {

    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private EmpleadoRepository empleadoRepository;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest request) {
        String correo = request.getEmail().trim().toLowerCase();
        Optional<Usuario> optUsuario = usuarioRepository.findByCorreo(correo);

        if (optUsuario.isEmpty()) {
            return new LoginResponse(null, null, null, "Credenciales incorrectas");
        }

        Usuario usuario = optUsuario.get();

        // Soporte para texto plano (BD legada) y bcrypt
        boolean passwordOk = passwordEncoder.matches(request.getPassword(), usuario.getContrasena())
                || request.getPassword().equals(usuario.getContrasena());

        if (!passwordOk) {
            return new LoginResponse(null, null, null, "Credenciales incorrectas");
        }

        if (usuario.getRol() == Usuario.Rol.empleado) {
            Optional<Empleado> empleado = empleadoRepository.findByUsuarioCorreo(correo);
            if (empleado.isEmpty() || empleado.get().getEstado() == Empleado.Estado.inactivo) {
                return new LoginResponse(null, null, null, "Empleado inactivo");
            }
        }

        String token = jwtUtil.generateToken(correo, usuario.getRol().name());
        return new LoginResponse(token, usuario.getRol().name(), correo, "Login exitoso");
    }

    @Transactional
    public ApiResponse registro(RegistroRequest request) {
        String correo = request.getEmail().trim().toLowerCase();

        if (usuarioRepository.existsByCorreo(correo)) {
            return new ApiResponse(false, "El correo ya esta registrado");
        }

        String primerNombre = request.getNombres().split(" ")[0].toLowerCase();
        String nombreUsuario = primerNombre + (new Random().nextInt(900) + 100);

        Usuario usuario = new Usuario();
        usuario.setNombreUsuario(nombreUsuario);
        usuario.setCorreo(correo);
        usuario.setContrasena(passwordEncoder.encode(request.getPassword()));

        try {
            usuario.setRol(Usuario.Rol.valueOf(request.getRol()));
        } catch (IllegalArgumentException e) {
            return new ApiResponse(false, "Rol invalido: " + request.getRol());
        }

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        Empleado empleado = new Empleado();
        empleado.setUsuario(usuarioGuardado);
        empleado.setNombres(request.getNombres());
        empleado.setApellidos(request.getApellidos());
        empleado.setCorreoPersonal(correo);
        empleado.setTelefono(request.getTelefono());
        empleado.setDireccion(request.getDireccion());
        empleado.setCargo(request.getCargo());
        empleado.setDepartamento(request.getDepartamento());

        if (request.getTipoDoc() != null && !request.getTipoDoc().isEmpty()) {
            try { empleado.setTipoDocumento(Empleado.TipoDocumento.valueOf(request.getTipoDoc())); }
            catch (IllegalArgumentException ignored) {}
        }
        if (request.getNumeroDoc() != null && !request.getNumeroDoc().isEmpty()) {
            empleado.setNumeroDocumento(request.getNumeroDoc());
        }
        if (request.getFechaInicio() != null && !request.getFechaInicio().isEmpty()) {
            empleado.setFechaInicio(LocalDate.parse(request.getFechaInicio()));
        }

        empleadoRepository.save(empleado);
        return new ApiResponse(true, "Registro exitoso. Usuario: " + nombreUsuario);
    }
}
