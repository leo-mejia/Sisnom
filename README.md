# Sisnom - Spring Boot

Proyecto Spring Boot 3.2 con JWT.


## Configuración

Editar `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/sisnom?serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=TU_PASSWORD
app.jwt.secret=CAMBIAR_EN_PRODUCCION_SECRETO_LARGO
```

## Cómo correr

```bash
# 1. Crear la base de datos (usar el script original)
mysql -u root -p < database/sisnom.sql

# 2. Compilar y ejecutar
mvn spring-boot:run

# El servidor queda en: http://localhost:8080
```

## Endpoints principales

### Autenticación (sin token)
```
POST /api/auth/login
Body: { "email": "...", "password": "..." }
Response: { "token": "...", "rol": "...", "email": "..." }

POST /api/auth/registro
Body: { nombres, apellidos, email, password, rol, tipoDoc, numeroDoc, cargo, departamento }
```

### Con token (header: Authorization: Bearer <token>)
```
GET    /api/perfil                  → Ver perfil propio
POST   /api/perfil                  → Actualizar perfil
DELETE /api/perfil                  → Desactivar cuenta

GET    /api/empleados               → Listar (admin/rrhh/contador)
PUT    /api/empleados/{id}/estado   → Cambiar estado (admin/rrhh)

GET    /api/solicitudes/mis-solicitudes
POST   /api/solicitudes
GET    /api/solicitudes/pendientes  (admin/rrhh)
PUT    /api/solicitudes/{id}/estado (admin/rrhh)

POST   /api/asistencia/entrada
POST   /api/asistencia/salida/{id}
GET    /api/asistencia/mi-asistencia
