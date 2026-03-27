package com.sisnom.controller;

import com.sisnom.model.Empleado;
import com.sisnom.repository.EmpleadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/empleados")
public class EmpleadoController {

    @Autowired private EmpleadoRepository empleadoRepository;

    // GET /api/empleados
    @GetMapping
@PreAuthorize("hasAnyRole('ADMIN', 'RECURSOS_HUMANOS', 'CONTADOR')")
    public ResponseEntity<List<Empleado>> listarEmpleados() {
        return ResponseEntity.ok(empleadoRepository.findAll());
    }

    // GET /api/empleados/{id}
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECURSOS_HUMANOS')")
    public ResponseEntity<?> getEmpleado(@PathVariable Integer id) {
        return empleadoRepository.findById(id)
                .map(emp -> ResponseEntity.ok((Object) emp))
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT /api/empleados/{id}/estado  → Body: { "estado": "activo" | "inactivo" }
    @PutMapping("/{id}/estado")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECURSOS_HUMANOS')")
    public ResponseEntity<?> cambiarEstado(@PathVariable Integer id,
                                           @RequestBody Map<String, String> body) {
        return empleadoRepository.findById(id).map(emp -> {
            emp.setEstado(Empleado.Estado.valueOf(body.get("estado")));
            empleadoRepository.save(emp);
            return ResponseEntity.ok((Object) Map.of("success", true, "mensaje", "Estado actualizado"));
        }).orElse(ResponseEntity.notFound().build());
    }
}
