document.addEventListener('DOMContentLoaded', () => {
  const submitButton = document.getElementById('submit-request');

  if (submitButton) {
    submitButton.addEventListener('click', (e) => {
      e.preventDefault();
      // Validación básica
      const inputs = document.querySelectorAll('.form-input');
      let filled = true;
      inputs.forEach(input => {
        if (!input.value.trim() && input.tagName !== 'TEXTAREA') filled = false;
      });

      if (!filled) {
        alert('Por favor completa las fechas de inicio y fin.');
        return;
      }

      alert('Solicitud de vacaciones enviada con éxito.');
      // Aquí normalmente enviarías los datos a un backend
    });
  }
});