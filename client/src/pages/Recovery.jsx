import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Recovery.css';

const Recovery = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulación de envío de correo
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (success) {
    return (
      <div className="main-layout">
        <div className="card-container">
          <div className="auth-card auth-card--recovery">
            <div className="recovery-success">
              <div className="success-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="success-title">Correo Enviado</h2>
              <p className="success-message">
                Se ha enviado un enlace de recuperación a <strong>{email}</strong>. 
                Por favor, revisa tu bandeja de entrada.
              </p>
              <p className="security-note">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                El enlace expirará en 24 horas por seguridad.
              </p>
              <button onClick={handleBackToLogin} className="btn btn-primary btn-full">
                Volver al Login
              </button>
            </div>
          </div>

          <div className="external-footer">
            <p className="copyright-text">SISNOM &copy; 2026 - Sistema de Gestión de Nómina</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-layout">
      <div className="card-container">
        <div className="auth-card auth-card--recovery">
          <div className="card-header">
            <button onClick={handleBackToLogin} className="btn-back" aria-label="Volver">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver
            </button>

            <div className="security-info">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="security-text">Seguridad</span>
            </div>
          </div>

          <div className="title-section">
            <h1 className="main-title">Recuperar Contraseña</h1>
            <p className="subtitle">
              Ingresa el correo electrónico asociado a tu cuenta de <strong>SISNOM</strong> para recibir las instrucciones de recuperación.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Correo Electrónico
              </label>
              <input 
                type="email" 
                id="email" 
                className="form-input" 
                placeholder="ejemplo@correo.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <p className="security-hint">
              * El enlace de recuperación expirará en 24 horas por motivos de seguridad.
            </p>

            <button type="submit" id="submitBtn" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? (
                <>Enviando...</>
              ) : (
                <>
                  <span>Enviar Enlace</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="footer-link-container">
            <button onClick={handleBackToLogin} className="footer-link">
              ¿Recordaste tu contraseña? Iniciar sesión
            </button>
          </div>
        </div>

        <div className="external-footer">
          <p className="copyright-text">SISNOM &copy; 2026 - Sistema de Gestión de Nómina</p>
        </div>
      </div>
    </div>
  );
};

export default Recovery;

