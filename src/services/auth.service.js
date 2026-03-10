const { users } = require("../data/users.memory");

//Servicio de autenticación.
class AuthService {
  /**
   * Registra un usuario si el correo no existe.
   * @param {string} usuario
   * @param {string} password
   * @returns {{success: boolean, message: string}}
   */
  register(usuario, password) {
    const normalizedUser = usuario.trim().toLowerCase();

    const exists = users.some((u) => u.usuario === normalizedUser);
    if (exists) {
      return { success: false, message: "El usuario ya está registrado" };
    }

    users.push({
      usuario: normalizedUser,
      password: password
    });

    return { success: true, message: "Registro exitoso" };
  }

  /**
   * Autentica usuario y contraseña.
   * @param {string} usuario
   * @param {string} password
   * @returns {{success: boolean, message: string}}
   */
  login(usuario, password) {
    const normalizedUser = usuario.trim().toLowerCase();

    const foundUser = users.find((u) => u.usuario === normalizedUser);
    if (!foundUser) {
      return { success: false, message: "Error en la autenticación" };
    }

    if (foundUser.password !== password) {
      return { success: false, message: "Error en la autenticación" };
    }

    return { success: true, message: "Autenticación satisfactoria" };
  }
}

module.exports = new AuthService();
