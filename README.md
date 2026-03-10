# sisnom-node-auth

Servicio web de registro e inicio de sesión con Node.js, Express y API REST.

## Requisitos

- Node.js (v14+)
- npm

## Instalación

npm install


## Ejecución

npm start


El servidor estará disponible en `http://localhost:3000`

## Endpoints

- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

## Estructura

```
src/
├── app.js              # Punto de entrada
├── controllers/        # Controladores
├── routes/            # Rutas
├── services/          # Lógica de negocio
├── data/              # Datos en memoria
└── middlewares/       # Middlewares
