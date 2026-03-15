# Sisnom - Sistema de Nómina Empresarial

Proyecto fullstack con backend Spring Boot 3.2 (JWT) y frontend ReactJS + Vite.

## Estructura del Proyecto

```
sisnom-springboot/
├── client/                 # Frontend ReactJS + Vite
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── context/        # Contextos de React (Auth)
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── services/      # Servicios API
│   │   ├── App.jsx        # Componente principal
│   │   └── main.jsx       # Punto de entrada
│   ├── index.html
│   └── package.json
├── src/                    # Backend Spring Boot
│   └── main/java/com/sisnom/
│       ├── config/         # Configuración
│       ├── controller/     # Controladores REST
│       ├── dto/           # Objetos de transferencia
│       ├── model/         # Entidades
│       ├── repository/     # Repositorios
│       ├── security/       # Seguridad JWT
│       └── service/        # Servicios
├── database/
│   └── sisnom.sql          # Script de base de datos
└── pom.xml                # Dependencias Maven
```

## Configuración del Backend (Spring Boot)

Editar `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/sisnom?serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=TU_PASSWORD
app.jwt.secret=CAMBIAR_EN_PRODUCCION_SECRETO_LARGO
```

## Configuración del Frontend (ReactJS)

El frontend está configurado para comunicarse con el backend en `http://localhost:8080`.

### Variables de entorno

Si necesitas cambiar la URL del API, editar `client/src/services/api.js`.

## Despliegue en Railway (Actualizado)

**Preparación DB:**
1. En Railway dashboard, crea nuevo proyecto → New → Database → MySQL.
2. Ve a Data tab del MySQL service → Connect → Copy vars: MYSQLHOST, MYSQLPORT, MYSQLDATABASE, MYSQLUSER, MYSQLPASSWORD.
3. En Query tab, paste & run content of `database/sisnom.sql`.

**Variables de entorno (Variables tab):**
Use `railway-env-reference.txt` as guide:
- SPRING_DATASOURCE_URL = `jdbc:mysql://${MYSQLHOST}:3306/${MYSQLDATABASE}?...` (or Railway auto-generates)
- SPRING_DATASOURCE_USERNAME, PASSWORD
- JWT_SECRET (generate strong 256+ bit key)
- JWT_EXPIRATION=86400000 (24h)
- CLIENT_URL = https://your-app-name.railway.app (your frontend URL)
- PORT (auto by Railway)

**Build & Deploy:**
1. Connect GitHub repo to Railway service.
2. railway.toml auto-configures startCommand.
3. Build will run npm build client → mvn package (pom.xml copies dist to static).
4. App serves frontend at / and API at /api/**.

**Verify:**
- Frontend at https://*.railway.app
- CORS allows CLIENT_URL.
- DB connected, auth works.

Local test: `npm run build --prefix client && mvn clean package && java -jar target/*.jar`


Al servir el frontend y el backend desde el mismo Spring Boot no es necesario cambiar la base (`API_BASE`) de `client/src/services/api.js`, pero `CLIENT_URL` se usa para limitar los orígenes permitidos en CORS cuando se prueban clientes externos.

## Cómo ejecutar el proyecto

### Opción 1: Ejecutar por separado

#### 1. Base de datos
```bash
# Crear la base de datos
mysql -u root -p < database/sisnom.sql
```

#### 2. Backend (Spring Boot)
```bash
# Compilar y ejecutar
mvn spring-boot:run

# El servidor queda en: http://localhost:8080
```

#### 3. Frontend (ReactJS)
```bash
# Ir al directorio client
cd client

# Instalar dependencias (solo la primera vez)
npm install

# Ejecutar en modo desarrollo
npm run dev

# El frontend queda en: http://localhost:5173
```

### Opción 2: Ejecutar con scripts npm (en client/)

```bash
cd client
npm install
npm run dev
```

## Rutas del Frontend

| Ruta | Descripción |
|------|-------------|
| `/` | Login - Inicio de sesión |
| `/register` | Registro de nuevos empleados |
| `/recuperar` | Recuperación de contraseña |
| `/admin` | Dashboard Administrador |
| `/rrhh` | Dashboard Recursos Humanos |
| `/contador` | Dashboard Contador |
| `/empleado` | Dashboard Empleado |

## Endpoints del Backend

### Autenticación (sin token)
```
POST /api/auth/login
Body: { "email": "...", "password": "..." }
Response: { "token": "...", "rol": "...", "email": "..." }

POST /api/auth/registro
Body: { nombres, apellidos, email, password, rol, tipoDoc, numeroDoc, cargo, departamento }
```

### Endpoints autenticados (header: Authorization: Bearer <token>)

```
GET    /api/perfil                  → Ver perfil propio
POST   /api/perfil                  → Actualizar perfil
DELETE /api/perfil                  → Desactivar cuenta

GET    /api/empleados               → Listar empleados (admin/rrhh/contador)
PUT    /api/empleados/{id}/estado   → Cambiar estado (admin/rrhh)

GET    /api/solicitudes/mis-solicitudes
POST   /api/solicitudes
GET    /api/solicitudes/pendientes  (admin/rrhh)
PUT    /api/solicitudes/{id}/estado (admin/rrhh)

POST   /api/asistencia/entrada
POST   /api/asistencia/salida/{id}
GET    /api/asistencia/mi-asistencia
```

## Roles de usuario

| Rol | Descripción |
|-----|-------------|
| `admin` | Administrador del sistema |
| `recursos_humanos` | Gestor de RRHH |
| `contador` | Área de contabilidad |
| `empleado` | Empleado regular |

## Tecnologías utilizadas

### Backend
- Spring Boot 3.2
- Spring Security
- JWT (JSON Web Tokens)
- MySQL
- Maven

### Frontend
- React 18
- React Router DOM 6
- Vite
- CSS3


