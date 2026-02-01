document.getElementById('loginForm').addEventListener('submit', function (e) {
      e.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();

      // Simulación de validación local
      if (email === 'admin@sisnom.com' && password === '1234') {
        alert('Inicio de sesión exitoso ✅');
        window.location.href = "../Administrador/administrador.html"; 
      } else if (email === 'empleado@sisnom.com' && password === '1234') {
        alert('Bienvenido empleado 👋');
        window.location.href = '../empleado/empleado.html'; 0
      } else {
        alert('❌ Correo o contraseña incorrectos');
      }
    });

  document.getElementById('olvidoContraseña').addEventListener('click', function () {
    window.location.href = '/recuperar contraseña/recuperar contraseña.html';
  });