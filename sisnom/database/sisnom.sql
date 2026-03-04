CREATE DATABASE IF NOT EXISTS sisnom;
USE sisnom;


CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(100) NOT NULL UNIQUE,
    correo VARCHAR(100) NOT NULL UNIQUE,       
    contraseña VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'empleado', 'contador', 'recursos_humanos') NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS empleado (
    id_empleado INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    tipo_documento ENUM('CC', 'CE', 'TI', 'PAP') NOT NULL,
    numero_documento VARCHAR(20) NOT NULL UNIQUE,
    correo_personal VARCHAR(100),
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    cargo VARCHAR(100),
    fecha_inicio DATE,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS contrato (
    id_contrato INT AUTO_INCREMENT PRIMARY KEY,
    id_empleado INT NOT NULL,
    tipo_contrato ENUM('fijo', 'indefinido', 'obra_labor', 'aprendizaje') NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    salario_base DECIMAL(10,2) NOT NULL,
    estado ENUM('activo', 'inactivo', 'finalizado') DEFAULT 'activo',
    FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado)
        ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS nomina (
    id_nomina INT AUTO_INCREMENT PRIMARY KEY,
    id_empleado INT NOT NULL,
    periodo_inicio DATE NOT NULL,
    periodo_fin DATE NOT NULL,
    total_devengado DECIMAL(10,2) NOT NULL,
    deducciones DECIMAL(10,2) DEFAULT 0,
    bonificaciones DECIMAL(10,2) DEFAULT 0,
    total_pagado DECIMAL(10,2) GENERATED ALWAYS AS (total_devengado - deducciones + bonificaciones) STORED,
    fecha_pago DATE,
    FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS deduccion (
    id_deduccion INT AUTO_INCREMENT PRIMARY KEY,
    concepto VARCHAR(100) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    id_nomina INT NOT NULL,
    FOREIGN KEY (id_nomina) REFERENCES nomina(id_nomina)
        ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS devengo (
    id_devengo INT AUTO_INCREMENT PRIMARY KEY,
    concepto VARCHAR(100) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    id_nomina INT NOT NULL,
    FOREIGN KEY (id_nomina) REFERENCES nomina(id_nomina)
        ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS pago (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_nomina INT NOT NULL,
    metodo_pago ENUM('transferencia','efectivo') NOT NULL,
    fecha_pago DATE NOT NULL,
    estado_pago ENUM('pendiente','completado') DEFAULT 'pendiente',
    referencia_pago VARCHAR(100),
    FOREIGN KEY (id_nomina) REFERENCES nomina(id_nomina)
        ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS solicitud (
    id_solicitud INT AUTO_INCREMENT PRIMARY KEY,
    tipo_solicitud ENUM('permiso','vacaciones','incapacidad') NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    motivo VARCHAR(255),
    estado ENUM('pendiente','aprobada','rechazada') DEFAULT 'pendiente',
    id_empleado INT NOT NULL,
    FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado)
        ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS asistencia (
    id_asistencia INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    hora_entrada TIME,
    hora_salida TIME,
    estado ENUM('presente','ausente','retraso') DEFAULT 'presente',
    id_empleado INT NOT NULL,
    FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado)
        ON DELETE CASCADE ON UPDATE CASCADE
);
