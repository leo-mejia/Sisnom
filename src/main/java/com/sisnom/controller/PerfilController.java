package com.sisnom.controller;

import com.sisnom.dto.ApiResponse;
import com.sisnom.dto.PerfilResponse;
import com.sisnom.dto.PerfilUpdateRequest;
import com.sisnom.service.PerfilService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/perfil")
public class PerfilController {

    @Autowired private PerfilService perfilService;

    // GET
    @GetMapping
    public ResponseEntity<PerfilResponse> obtenerPerfil(@AuthenticationPrincipal UserDetails userDetails) {
        PerfilResponse response = perfilService.obtenerPerfil(userDetails.getUsername());
        if (!response.isSuccess()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(response);
    }

    // PUT
    @PutMapping
    public ResponseEntity<ApiResponse> actualizarPerfil(@AuthenticationPrincipal UserDetails userDetails,
                                                         @Valid @RequestBody PerfilUpdateRequest request) {
        ApiResponse response = perfilService.actualizarPerfil(userDetails.getUsername(), request);
        if (!response.isSuccess()) return ResponseEntity.badRequest().body(response);
        return ResponseEntity.ok(response);
    }

    // DELETE
    @DeleteMapping
    public ResponseEntity<ApiResponse> eliminarPerfil(@AuthenticationPrincipal UserDetails userDetails) {
        ApiResponse response = perfilService.eliminarPerfil(userDetails.getUsername());
        if (!response.isSuccess()) return ResponseEntity.badRequest().body(response);
        return ResponseEntity.ok(response);
    }
}
