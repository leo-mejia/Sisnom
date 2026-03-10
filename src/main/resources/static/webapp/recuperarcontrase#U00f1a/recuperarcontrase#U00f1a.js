function handleRecovery(event) {
            event.preventDefault();
            const emailInput = document.getElementById('email');
            const submitBtn = document.getElementById('submitBtn');
            const successMessage = document.getElementById('successMessage');
            const form = document.getElementById('recoveryForm');

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Enviando...</span>';

            setTimeout(() => {
                form.style.display = 'none';
                successMessage.style.display = 'block';
                console.log('Correo enviado a:', emailInput.value);
            }, 1500);
        }