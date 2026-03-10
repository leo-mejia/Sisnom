document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registroForm');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm_password');
    const passwordError = document.getElementById('passwordError');

    // Validar que las contraseñas coincidan
    confirmPassword.addEventListener('input', function() {
        if (password.value !== confirmPassword.value) {
            passwordError.style.display = 'block';
        } else {
            passwordError.style.display = 'none';
        }
    });

    password.addEventListener('input', function() {
        if (password.value !== confirmPassword.value && confirmPassword.value !== '') {
            passwordError.style.display = 'block';
        } else {
            passwordError.style.display = 'none';
        }
    });

    // Manejar el envío del formulario
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validar contraseñas
        if (password.value !== confirmPassword.value) {
            alert('Las contraseñas no coinciden');
            return;
        }

        // Recopilar los datos del formulario y mapear los nombres de campos
        const formData = new FormData(form);
        const data = {
            nombres: formData.get('nombres'),
            apellidos: formData.get('apellidos'),
            email: formData.get('email'),
            password: formData.get('password'),
            rol: formData.get('rol'),
            tipoDoc: formData.get('tipo_doc'),
            numeroDoc: formData.get('numero_doc'),
            telefono: formData.get('telefono'),
            direccion: formData.get('direccion'),
            cargo: formData.get('cargo'),
            departamento: formData.get('departamento'),
            fechaInicio: formData.get('fecha_inicio')
        };

        console.log('Datos enviados:', data);

        try {
            const response = await fetch('/api/auth/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            console.log('Respuesta:', result);

            if (response.ok && result.success) {
                alert('Registro exitoso. Ahora puede iniciar sesión.');
                window.location.href = '../../index.html';
            } else {
                alert('Error en el registro: ' + (result.message || 'Intente nuevamente'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión. Intente más tarde.');
        }
    });
});
