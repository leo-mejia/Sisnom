// Funcionalidad básica de recuperación de contraseña
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const emailInput = document.getElementById('email');
  const submitButton = document.getElementById('submit-btn');

  // Opcional: manejar clic en "Volver"
  const backButton = document.querySelector('.back-button');
  if (backButton) {
    backButton.addEventListener('click', () => {
      window.history.back();
    });
  }

  // Opcional: manejar envío del formulario
  if (submitButton) {
    submitButton.addEventListener('click', (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      if (!email || !email.includes('@')) {
        alert('Por favor ingresa un correo electrónico válido.');
        return;
      }
      // Aquí iría la lógica de envío (fetch, etc.)
      alert(`Se enviará un enlace de recuperación a: ${email}`);
      // Ejemplo: fetch('/api/reset-password', { method: 'POST', body: JSON.stringify({ email }) })
    });
  }
});