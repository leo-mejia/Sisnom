package com.sisnom.repository;

import com.sisnom.model.Empleado;
import com.sisnom.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface EmpleadoRepository extends JpaRepository<Empleado, Integer> {

    Optional<Empleado> findByUsuario(Usuario usuario);

    @Query("SELECT e FROM Empleado e WHERE e.usuario.correo = :correo AND e.estado = 'activo'")
    Optional<Empleado> findByUsuarioCorreoAndActivo(String correo);

    Optional<Empleado> findByUsuarioCorreo(String correo);
}
