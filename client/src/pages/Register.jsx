import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import './Register.css';

const Register = () => {
  // Obtener fecha actual en formato YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    password: '',
    confirmPassword: '',
    tipoDocumento: 'CC',
    numeroDocumento: '',
    telefono: '',
    direccion: '',
    cargo: '',
    departamento: '',
    fechaInicio: today,
    rol: 'empleado'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const showPasswordMismatch =
    formData.password &&
    formData.confirmPassword &&
    formData.password !== formData.confirmPassword;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const response = await register({
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        email: formData.email,
        password: formData.password,
        tipoDocumento: formData.tipoDocumento,
        numeroDocumento: formData.numeroDocumento,
        telefono: formData.telefono,
        direccion: formData.direccion,
        cargo: formData.cargo,
        departamento: formData.departamento,
        fechaInicio: formData.fechaInicio,
        rol: formData.rol
      });

      if (response.success) {
        alert('Registro exitoso. Por favor inicia sesión.');
        navigate('/login');
      } else {
        setError(response.mensaje || 'Error en el registro');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-layout">
      <div className="card-container">
        <div className="auth-card auth-card--register">
          <header className="header-section">
            <button
              type="button"
              className="btn-back"
              onClick={() => navigate('/login')}
              aria-label="Volver"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <div className="title-group">
              <h1>Registro de Empleado</h1>
              <p>Complete los campos para registrarse en SISNOM</p>
            </div>
          </header>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="section-divider">Configuración de Usuario</div>

              <div className="form-group">
                <label className="form-label">Rol en Sistema *</label>
                <select
                  name="rol"
                  className="form-select"
                  value={formData.rol}
                  onChange={handleChange}
                  required
                >
                  <option value="empleado">Empleado</option>
                  <option value="admin">Administrador</option>
                  <option value="contador">Contador</option>
                  <option value="recursos_humanos">Recursos Humanos</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Contraseña *</label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirmar Contraseña *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <span
                  className="error-text password-error"
                  style={{ display: showPasswordMismatch ? 'block' : 'none' }}
                >
                  Las contraseñas no coinciden
                </span>
              </div>

              <div className="section-divider">Identificación</div>

              <div className="form-group">
                <label className="form-label">Nombres *</label>
                <input
                  type="text"
                  name="nombres"
                  className="form-input"
                  placeholder="Nombres completos"
                  value={formData.nombres}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Apellidos *</label>
                <input
                  type="text"
                  name="apellidos"
                  className="form-input"
                  placeholder="Apellidos completos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tipo de Documento *</label>
                <select
                  name="tipoDocumento"
                  className="form-select"
                  value={formData.tipoDocumento}
                  onChange={handleChange}
                  required
                >
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="TI">Tarjeta de Identidad</option>
                  <option value="PAP">Pasaporte</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Número de Documento *</label>
                <input
                  type="text"
                  name="numeroDocumento"
                  className="form-input"
                  placeholder="Sin puntos ni comas"
                  value={formData.numeroDocumento}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="section-divider">Información de Contacto</div>

              <div className="form-group">
                <label className="form-label">Email Corporativo / Personal</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Teléfono / Celular</label>
                <input
                  type="tel"
                  name="telefono"
                  className="form-input"
                  placeholder="Ej. 3101234567"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Dirección de Residencia</label>
                <input
                  type="text"
                  name="direccion"
                  className="form-input"
                  placeholder="Calle, Carrera, Ciudad, Barrio"
                  value={formData.direccion}
                  onChange={handleChange}
                />
              </div>

              <div className="section-divider">Datos de Empresa</div>

              <div className="form-group">
                <label className="form-label">Cargo Asignado</label>
                <select
                  name="cargo"
                  className="form-select"
                  value={formData.cargo}
                  onChange={handleChange}
                >
                  <option value="">Seleccione un cargo...</option>
                  <option value="analista_nomina">Analista de Nómina</option>
                  <option value="auxiliar_contable">Auxiliar Contable</option>
                  <option value="gerente_rh">Gerente de Recursos Humanos</option>
                  <option value="desarrollador">Desarrollador de Sistemas</option>
                  <option value="contador_general">Contador General</option>
                  <option value="secretaria">Secretario/a Ejecutivo/a</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Departamento</label>
                <select
                  name="departamento"
                  className="form-select"
                  value={formData.departamento}
                  onChange={handleChange}
                >
                  <option value="">Seleccione un departamento...</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Tecnologia">Tecnología</option>
                  <option value="Finanzas">Finanzas</option>
                  <option value="Recursos Humanos">Recursos Humanos</option>
                  <option value="Operaciones">Operaciones</option>
                  <option value="Contabilidad">Contabilidad</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Fecha de Inicio (Ingreso)</label>
                <input
                  type="date"
                  name="fechaInicio"
                  className="form-input"
                  value={formData.fechaInicio}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && <p className="error">{error}</p>}

            <div className="form-actions">
              <button type="button" className="btn-discard" onClick={() => navigate('/login')}>
                Descartar
              </button>
              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? 'Registrando...' : 'Finalizar Registro'}
              </button>
            </div>
          </form>
        </div>

        <p className="footer-text">SISNOM © 2026 - Módulo de Registro</p>
      </div>
    </div>
  );
};

export default Register;
