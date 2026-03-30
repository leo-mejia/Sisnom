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

    // GET /api/solicitudes/mis-solicitudes  — cualquier usuario autenticado
    @GetMapping("/mis-solicitudes")
    public ResponseEntity<?> misSolicitudes(@AuthenticationPrincipal UserDetails user) {
        Usuario usuario = usuarioRepository.findByCorreo(user.getUsername()).orElseThrow();
        Empleado empleado = empleadoRepository.findByUsuario(usuario).orElseThrow();
        return ResponseEntity.ok(solicitudRepository.findByEmpleado(empleado));
    }

    // POST /api/solicitudes  — cualquier usuario autenticado
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

    // GET /api/solicitudes/pendientes  — solo admin o recursos_humanos
    @GetMapping("/pendientes")
    @PreAuthorize("hasAnyAuthority('admin', 'recursos_humanos')")
    public ResponseEntity<?> pendientes() {
        List<Solicitud> solicitudes = solicitudRepository.findByEstado(Solicitud.Estado.pendiente);
        List<Map<String, Object>> result = solicitudes.stream().map(sol -> Map.<String, Object>of(
            "id",             sol.getIdSolicitud(),
            "tipoSolicitud",  sol.getTipoSolicitud().name(),
            "fechaInicio",    sol.getFechaInicio().toString(),
            "fechaFin",       sol.getFechaFin().toString(),
            "motivo",         sol.getMotivo() != null ? sol.getMotivo() : "",
            "estado",         sol.getEstado().name(),
            "nombreUsuario",  sol.getEmpleado().getNombres() + " " + sol.getEmpleado().getApellidos()
        )).toList();
        return ResponseEntity.ok(result);
    }

    // PUT /api/solicitudes/{id}/estado  — solo admin o recursos_humanos
    @PutMapping("/{id}/estado")
    @PreAuthorize("hasAnyAuthority('admin', 'recursos_humanos')")
    public ResponseEntity<?> actualizarEstado(@PathVariable Integer id,
                                               @RequestBody Map<String, String> body) {
        return solicitudRepository.findById(id).map(sol -> {
            sol.setEstado(Solicitud.Estado.valueOf(body.get("estado")));
            solicitudRepository.save(sol);
            return ResponseEntity.ok((Object) Map.of("success", true));
        }).orElse(ResponseEntity.notFound().build());
    }
}
