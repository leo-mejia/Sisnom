const authService = require("../services/auth.service");


class AuthController {

   //Endpoint de registro.
   //Body esperado: { "usuario": "...", "password": "..." }
  
  register(req, res) {
    const { usuario, password } = req.body;


    if (!usuario || !password) {
      return res.status(400).json({
        success: false,
        message: "usuario y password son obligatorios"
      });
    }

    const result = authService.register(usuario, password);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  }


   //Endpoint de inicio de sesión.
   //Body esperado: { "usuario": "...", "password": "..." }

  login(req, res) {
    const { usuario, password } = req.body;


    if (!usuario || !password) {
      return res.status(400).json({
        success: false,
        message: "usuario y password son obligatorios"
      });
    }

    const result = authService.login(usuario, password);

    if (!result.success) {
      return res.status(401).json(result);
    }

    return res.status(200).json(result);
  }
}

module.exports = new AuthController();
