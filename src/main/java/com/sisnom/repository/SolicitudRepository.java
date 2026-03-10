package com.sisnom.repository;

import com.sisnom.model.Empleado;
import com.sisnom.model.Solicitud;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SolicitudRepository extends JpaRepository<Solicitud, Integer> {
    List<Solicitud> findByEmpleado(Empleado empleado);
    List<Solicitud> findByEstado(Solicitud.Estado estado);
}
