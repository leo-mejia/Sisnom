package com.sisnom.controller;

import com.sisnom.dto.*;
import com.sisnom.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private AuthService authService;

    // POST /api/auth/login
    // Body: { "email": "correo@test.com", "password": "123456" }
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        if (response.getToken() == null) {
            return ResponseEntity.status(401).body(response);
        }
        return ResponseEntity.ok(response);
    }

    // POST /api/auth/registro
    // Body: { "nombres": "Juan", "apellidos": "Perez", "email": "...", "password": "...", "rol": "empleado", ... }
    @PostMapping("/registro")
    public ResponseEntity<ApiResponse> registro(@Valid @RequestBody RegistroRequest request) {
        ApiResponse response = authService.registro(request);
        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.status(201).body(response);
    }
}
