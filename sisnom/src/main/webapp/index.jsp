<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SISNOM - Iniciar Sesión</title>
    <link rel="stylesheet" href="inicio_sisnom/iniciosisnom.css">
</head>
<body>
    <div class="main-layout">

        <div class="card-container">
            <div class="auth-card">

                <div class="logo-section">
                    <div class="logo-svg">
                        <svg width="60" height="60" viewBox="0 0 87 87" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M68.6318 10.8435L18.0643 10.8646C14.0747 10.8663 10.8417 14.1019 10.8434 18.0916L10.8646 68.6591C10.8663 72.6487 14.1019 75.8816 18.0916 75.88L68.659 75.8588C72.6487 75.8571 75.8816 72.6215 75.8799 68.6318L75.8587 18.0644C75.8571 14.0747 72.6214 10.8418 68.6318 10.8435Z" fill="black"/>
                            <path d="M21.6824 25.311L65.0259 25.2929L65.0289 32.5168L21.6854 32.535L21.6824 25.311Z" fill="white"/>
                            <path d="M21.6884 39.7589L43.3602 39.7498L43.3632 46.9738L21.6914 46.9828L21.6884 39.7589Z" fill="white"/>
                            <path d="M54.196 39.7452L65.0319 39.7407L65.035 46.9646L54.1991 46.9692L54.196 39.7452Z" fill="white"/>
                            <path d="M21.6945 54.2068L65.038 54.1886L65.041 61.4125L21.6975 61.4307L21.6945 54.2068Z" fill="white"/>
                        </svg>
                    </div>
                    <h1 class="main-title">SISNOM</h1>
                    <p class="subtitle">Sistema de Nómina Empresarial</p>
                </div>

        <form id="loginForm" action="login" method="POST">
            <div class="form-group">
                <input
                    type="email"
                    id="email"
                    name="email"
                    class="form-input"
                    placeholder="Correo electrónico"
                    required
                >
            </div>

            <div class="form-group">
                <input
                    type="password"
                    id="password"
                    name="password"
                    class="form-input"
                    placeholder="Contraseña"
                    required
                >
            </div>

            <div class="options-row">
                <label class="remember-me">
                    <input type="checkbox" id="remember" style="accent-color: black; width: 14px; height: 14px;">
                    <span>Recordarme</span>
                </label>
                <a href="recuperarcontraseña/recuperarcontraseña.html" class="forgot-link">
                    ¿Olvidó su contraseña?
                </a>
            </div>

            <button type="submit" id="submitBtn" class="btn-submit">
                Iniciar Sesión
            </button>

            <a href="registro/registro.html" class="btn-register">
                Crear una cuenta
            </a>

            <p class="admin-help">
                ¿Necesitas ayuda? Contacta al administrador
            </p>
        </form>
            </div>

            <div class="external-footer">
                <p class="copyright-text">
                    SISNOM &copy; 2026 - Gestión de Nómina
                </p>
            </div>
        </div>
    </div>


</body>
</html>