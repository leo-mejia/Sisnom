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

    @Autowired
    private EmpleadoRepository empleadoRepository;

    // GET /api/empleados  — admin, recursos_humanos, contador
    @GetMapping
    @PreAuthorize("hasAnyAuthority('admin', 'recursos_humanos', 'contador')")
    public ResponseEntity<List<Empleado>> listarEmpleados() {
        return ResponseEntity.ok(empleadoRepository.findAll());
    }

    // GET /api/empleados/{id}  — admin, recursos_humanos
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('admin', 'recursos_humanos')")
    public ResponseEntity<?> getEmpleado(@PathVariable Integer id) {
        return empleadoRepository.findById(id)
                .map(emp -> ResponseEntity.ok((Object) emp))
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT /api/empleados/{id}/estado  — admin, recursos_humanos
    @PutMapping("/{id}/estado")
    @PreAuthorize("hasAnyAuthority('admin', 'recursos_humanos')")
    public ResponseEntity<?> cambiarEstado(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        return empleadoRepository.findById(id).map(emp -> {
            emp.setEstado(Empleado.Estado.valueOf(body.get("estado")));
            empleadoRepository.save(emp);
            return ResponseEntity.ok((Object) Map.of("success", true, "mensaje", "Estado actualizado"));
        }).orElse(ResponseEntity.notFound().build());
    }
}
