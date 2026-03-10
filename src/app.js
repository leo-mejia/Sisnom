const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/auth.routes");
const errorMiddleware = require("./middlewares/error.middleware");


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

/** servicio está activo.*/
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Servicio activo"
  });
});

//endpoints de autenticación
app.use("/api/auth", authRoutes);

// Middleware 
app.use(errorMiddleware);

// Puerto configurable por variable de entorno
const PORT = process.env.PORT || 3000;

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor Node.js ejecutándose en http://localhost:${PORT}`);
});
