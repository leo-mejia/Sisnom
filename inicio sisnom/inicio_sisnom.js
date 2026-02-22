        function handleLogin(event) {
            event.preventDefault();
            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.innerText;
            submitBtn.disabled = true;
            submitBtn.innerText = 'Verificando...';
            
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;
            }, 1500);
        }