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
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudController {

    @Autowired private SolicitudRepository solicitudRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private EmpleadoRepository empleadoRepository;

    // GET 
    @GetMapping("/mis-solicitudes")
    public ResponseEntity<?> misSolicitudes(@AuthenticationPrincipal UserDetails user) {
        Usuario usuario = usuarioRepository.findByCorreo(user.getUsername()).orElseThrow();
        Empleado empleado = empleadoRepository.findByUsuario(usuario).orElseThrow();
        List<Solicitud> lista = solicitudRepository.findByEmpleado(empleado);
        return ResponseEntity.ok(lista);
    }

    // POST
    @PostMapping
    public ResponseEntity<?> crearSolicitud(@AuthenticationPrincipal UserDetails user,
                                             @RequestBody Map<String, String> body) {
        Usuario usuario = usuarioRepository.findByCorreo(user.getUsername()).orElseThrow();
        Empleado empleado = empleadoRepository.findByUsuario(usuario).orElseThrow();

        Solicitud solicitud = new Solicitud();
        solicitud.setEmpleado(empleado);
        solicitud.setTipoSolicitud(Solicitud.TipoSolicitud.valueOf(body.get("tipoSolicitud")));
        solicitud.setFechaInicio(LocalDate.parse(body.get("fechaInicio")));
        solicitud.setFechaFin(LocalDate.parse(body.get("fechaFin")));
        solicitud.setMotivo(body.get("motivo"));
        solicitudRepository.save(solicitud);

        return ResponseEntity.ok(Map.of("success", true, "mensaje", "Solicitud enviada"));
    }

    // GET 
    @GetMapping("/pendientes")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECURSOS_HUMANOS')")
    public ResponseEntity<?> pendientes() {
        return ResponseEntity.ok(solicitudRepository.findByEstado(Solicitud.Estado.pendiente));
    }

    // PUT 
    @PutMapping("/{id}/estado")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECURSOS_HUMANOS')")
    public ResponseEntity<?> actualizarEstado(@PathVariable Integer id,
                                               @RequestBody Map<String, String> body) {
        return solicitudRepository.findById(id).map(sol -> {
            sol.setEstado(Solicitud.Estado.valueOf(body.get("estado")));
            solicitudRepository.save(sol);
            return ResponseEntity.ok((Object) Map.of("success", true));
        }).orElse(ResponseEntity.notFound().build());
    }
}
