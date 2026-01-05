document.getElementById('loginForm').addEventListener('submit', function (e) {
      e.preventDefault(); // evita el error 405

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();

      // Simulación de validación local
      if (email === 'admin@sisnom.com' && password === '1234') {
        alert('Inicio de sesión exitoso ✅');
        window.location.href = 'administrador.html'; // redirige a la página del administrador
      } else if (email === 'empleado@sisnom.com' && password === '1234') {
        alert('Bienvenido empleado 👋');
        window.location.href = 'empleado.html'; // redirige a la página del empleado
      } else {
        alert('❌ Correo o contraseña incorrectos');
      }
    });

  