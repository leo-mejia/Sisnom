package com.sisnom.controller;

import com.sisnom.model.*;
import com.sisnom.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;

@RestController
@RequestMapping("/api/asistencia")
public class AsistenciaController {

    @Autowired private AsistenciaRepository asistenciaRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private EmpleadoRepository empleadoRepository;

    // POST /api/asistencia/entrada  — cualquier usuario autenticado
    @PostMapping("/entrada")
    public ResponseEntity<?> registrarEntrada(@AuthenticationPrincipal UserDetails user) {
        Empleado empleado = getEmpleado(user.getUsername());
        Asistencia asistencia = new Asistencia();
        asistencia.setEmpleado(empleado);
        asistencia.setFecha(LocalDate.now());
        asistencia.setHoraEntrada(LocalTime.now());
        Asistencia saved = asistenciaRepository.save(asistencia);
        // Devolvemos el id para poder registrar la salida después
        return ResponseEntity.ok(Map.of(
            "success", true,
            "mensaje", "Entrada registrada",
            "id", saved.getIdAsistencia()
        ));
    }

    // POST /api/asistencia/salida/{id}  — cualquier usuario autenticado
    @PostMapping("/salida/{id}")
    public ResponseEntity<?> registrarSalida(@PathVariable Integer id) {
        return asistenciaRepository.findById(id).map(a -> {
            a.setHoraSalida(LocalTime.now());
            asistenciaRepository.save(a);
            return ResponseEntity.ok((Object) Map.of("success", true, "mensaje", "Salida registrada"));
        }).orElse(ResponseEntity.notFound().build());
    }

    // GET /api/asistencia/mi-asistencia  — cualquier usuario autenticado
    @GetMapping("/mi-asistencia")
    public ResponseEntity<?> miAsistencia(@AuthenticationPrincipal UserDetails user) {
        Empleado empleado = getEmpleado(user.getUsername());
        return ResponseEntity.ok(asistenciaRepository.findByEmpleado(empleado));
    }

    // GET /api/asistencia/empleado/{id}  — solo admin o recursos_humanos
    @GetMapping("/empleado/{id}")
    @PreAuthorize("hasAnyAuthority('admin', 'recursos_humanos')")
    public ResponseEntity<?> asistenciaEmpleado(@PathVariable Integer id) {
        return empleadoRepository.findById(id)
                .map(emp -> ResponseEntity.ok((Object) asistenciaRepository.findByEmpleado(emp)))
                .orElse(ResponseEntity.notFound().build());
    }

    private Empleado getEmpleado(String email) {
        Usuario usuario = usuarioRepository.findByCorreo(email).orElseThrow();
        return empleadoRepository.findByUsuario(usuario).orElseThrow();
    }
}
