package com.sisnom.repository;

import com.sisnom.model.Asistencia;
import com.sisnom.model.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AsistenciaRepository extends JpaRepository<Asistencia, Integer> {
    List<Asistencia> findByEmpleado(Empleado empleado);
}
