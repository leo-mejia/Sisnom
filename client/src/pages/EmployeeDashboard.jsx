import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile, deleteProfile, getMyAttendance, registerEntry, getMyRequests, createRequest } from '../services/api';

const EmployeeDashboard = () => {
  const { logout: authLogout } = useAuth();
  const [activeSection, setActiveSection] = useState('inicio');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [attendance, setAttendance] = useState([]);
  const [requests, setRequests] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(null);
  const [requestFormData, setRequestFormData] = useState({});

  useEffect(() => {
    loadProfile();
    loadAttendance();
    loadRequests();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      if (data && data.success) {
        setProfile(data);
        setEditData({
          nombres: data.nombres || '',
          apellidos: data.apellidos || '',
          correo: data.correo || '',
          telefono: data.telefono || '',
          direccion: data.direccion || '',
          cargo: data.cargo || '',
          departamento: data.departamento || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAttendance = async () => {
    try {
      const data = await getMyAttendance();
      setAttendance(data || []);
    } catch (error) {
      console.error('Error loading attendance:', error);
    }
  };

  const loadRequests = async () => {
    try {
      const data = await getMyRequests();
      setRequests(data || []);
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  };

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    if (profile) {
      setEditData({
        nombres: profile.nombres || '',
        apellidos: profile.apellidos || '',
        correo: profile.correo || '',
        telefono: profile.telefono || '',
        direccion: profile.direccion || '',
        cargo: profile.cargo || '',
        departamento: profile.departamento || ''
      });
    }
  };

  const handleSave = async () => {
    try {
      const result = await updateProfile(editData);
      if (result.success) {
        alert('Cambios guardados exitosamente');
        loadProfile();
        setEditMode(false);
      } else {
        alert(result.mensaje || 'Error al guardar');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error de conexión');
    }
  };

  const handleDelete = async () => {
    const confirm1 = window.confirm('¿Estás seguro que deseas eliminar tu perfil?');
    if (!confirm1) return;
    const confirm2 = window.confirm('Esta acción es irreversible. ¿Deseas continuar?');
    if (!confirm2) return;

    try {
      const result = await deleteProfile();
      if (result.success) {
        alert('Perfil eliminado');
        authLogout();
      } else {
        alert(result.mensaje || 'Error al eliminar');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  const handleRegisterAttendance = async () => {
    try {
      const result = await registerEntry();
      if (result.success) {
        alert('Asistencia registrada correctamente');
        loadAttendance();
      } else {
        alert('Error al registrar asistencia');
      }
    } catch (error) {
      console.error('Error registering attendance:', error);
    }
  };

  const handleSubmitRequest = async (tipo) => {
    try {
      const data = {
        tipoSolicitud: tipo.toUpperCase(),
        ...requestFormData
      };
      const result = await createRequest(data);
      if (result.success) {
        alert('Solicitud enviada correctamente');
        setShowRequestForm(null);
        setRequestFormData({});
        loadRequests();
      } else {
        alert('Error al enviar solicitud');
      }
    } catch (error) {
      console.error('Error creating request:', error);
    }
  };

  const handleLogout = () => {
    authLogout();
  };

  const getInitials = () => {
    if (!profile) return '??';
    const nombres = profile.nombres || '';
    const apellidos = profile.apellidos || '';
    return (nombres.charAt(0) + apellidos.charAt(0)).toUpperCase();
  };

  const getFullName = () => {
    if (!profile) return 'Usuario';
    return `${profile.nombres || ''} ${profile.apellidos || ''}`.trim() || 'Usuario';
  };

  const renderNavItem = (id, icon, label) => (
    <Link 
      to={`#${id}`} 
      className={`nav-item ${activeSection === id ? 'active' : ''}`}
      onClick={(e) => { e.preventDefault(); setActiveSection(id); }}
    >
      <div dangerouslySetInnerHTML={{ __html: icon }} />
      <span>{label}</span>
    </Link>
  );

  const icons = {
    home: '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256"><path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"></path></svg>',
    payroll: '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256"><path d="M152,120H136V56h8a32,32,0,0,1,32,32,8,8,0,0,0,16,0,48.05,48.05,0,0,0-48-48h-8V24a8,8,0,0,0-16,0V40h-8a48,48,0,0,0,0,96h8v64H104a32,32,0,0,1-32-32,8,8,0,0,0-16,0,48.05,48.05,0,0,0,48,48h16v16a8,8,0,0,0,16,0V216h16a48,48,0,0,0,0-96Zm-40,0a32,32,0,0,1,0-64h8v64Zm40,80H136V136h16a32,32,0,0,1,0,64Z"></path></svg>',
    requests: '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256"><path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-32-80a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,136Zm0,32a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,168Z"></path></svg>',
    attendance: '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"></path></svg>',
    notifications: '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256"><path d="M221.8,175.94C216.25,166.38,208,139.66,208,104a80,80,0,1,0-160,0c0,35.66-8.25,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.3,66.75,16,80Z"></path></svg>',
    help: '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256"><path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path></svg>',
    logout: '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256"><path d="M120,216a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H56v160h56A8,8,0,0,1,120,216ZM178.83,133.66l-40-40a8,8,0,0,0-11.32,11.32L156.69,134H88a8,8,0,0,0,0,16h68.66l-29.17,29.17a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,178.83,133.66Z"></path></svg>'
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="main-container">
      <aside className="sidebar">
        <div className="sidebar-section">
          <div className="user-profile-summary">
            <div className="avatar">
              <span>{getInitials()}</span>
            </div>
            <div className="user-info">
              <h2>{getFullName()}</h2>
              <p>Empleado</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {renderNavItem('inicio', icons.home, 'Inicio')}
          {renderNavItem('nomina', icons.payroll, 'Nómina')}
          {renderNavItem('solicitudes', icons.requests, 'Solicitudes')}
          {renderNavItem('asistencia', icons.attendance, 'Asistencia')}
          {renderNavItem('notificaciones', icons.notifications, 'Notificaciones')}
          {renderNavItem('ayuda', icons.help, 'Ayuda y Soporte')}
        </nav>

        <div className="sidebar-footer">
          <Link to="#" className="nav-item" onClick={handleLogout}>
            <div dangerouslySetInnerHTML={{ __html: icons.logout }} />
            <span>Cerrar Sesión</span>
          </Link>
        </div>
      </aside>

      <main className="content">
        <div className="mb-6">
          <h1>Panel de Control del Empleado</h1>
        </div>

        {/* Profile Section */}
        {activeSection === 'inicio' && (
          <div className="mb-8">
            <h2>Perfil Personal</h2>
            <div className="card">
              {!editMode ? (
                <div id="vistaPerfil">
                  <div className="profile-grid">
                    <div className="profile-item">
                      <p className="text-label">Nombre</p>
                      <p className="text-value">{profile?.nombres || 'No especificado'}</p>
                    </div>
                    <div className="profile-item">
                      <p className="text-label">Apellidos</p>
                      <p className="text-value">{profile?.apellidos || 'No especificado'}</p>
                    </div>
                    <div className="profile-item">
                      <p className="text-label">Cargo</p>
                      <p className="text-value">{profile?.cargo || 'No especificado'}</p>
                    </div>
                    <div className="profile-item">
                      <p className="text-label">Departamento</p>
                      <p className="text-value">{profile?.departamento || 'No especificado'}</p>
                    </div>
                    <div className="profile-item">
                      <p className="text-label">Correo</p>
                      <p className="text-value">{profile?.correo || 'No especificado'}</p>
                    </div>
                    <div className="profile-item">
                      <p className="text-label">Teléfono</p>
                      <p className="text-value">{profile?.telefono || 'No especificado'}</p>
                    </div>
                    <div className="profile-item">
                      <p className="text-label">Dirección</p>
                      <p className="text-value">{profile?.direccion || 'No especificado'}</p>
                    </div>
                    <div className="profile-item">
                      <p className="text-label">Fecha de Ingreso</p>
                      <p className="text-value">{profile?.fechaInicio || 'No especificada'}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button className="btn btn-secondary" onClick={handleEdit}>
                      Actualizar Perfil
                    </button>
                  </div>
                </div>
              ) : (
                <div className="form-edicion">
                  <div className="profile-grid">
                    <div className="profile-item">
                      <p className="text-label">Nombres</p>
                      <input
                        type="text"
                        className="form-input"
                        value={editData.nombres}
                        onChange={(e) => setEditData({...editData, nombres: e.target.value})}
                      />
                    </div>
                    <div className="profile-item">
                      <p className="text-label">Apellidos</p>
                      <input
                        type="text"
                        className="form-input"
                        value={editData.apellidos}
                        onChange={(e) => setEditData({...editData, apellidos: e.target.value})}
                      />
                    </div>
                    <div className="profile-item">
                      <p className="text-label">Correo</p>
                      <input
                        type="email"
                        className="form-input"
                        value={editData.correo}
                        onChange={(e) => setEditData({...editData, correo: e.target.value})}
                      />
                    </div>
                    <div className="profile-item">
                      <p className="text-label">Teléfono</p>
                      <input
                        type="tel"
                        className="form-input"
                        value={editData.telefono}
                        onChange={(e) => setEditData({...editData, telefono: e.target.value})}
                      />
                    </div>
                    <div className="profile-item">
                      <p className="text-label">Dirección</p>
                      <input
                        type="text"
                        className="form-input"
                        value={editData.direccion}
                        onChange={(e) => setEditData({...editData, direccion: e.target.value})}
                      />
                    </div>
                    <div className="profile-item">
                      <p className="text-label">Cargo</p>
                      <select
                        className="form-input"
                        value={editData.cargo}
                        onChange={(e) => setEditData({...editData, cargo: e.target.value})}
                      >
                        <option value="">Seleccionar cargo</option>
                        <option value="analista_nomina">Analista de Nómina</option>
                        <option value="auxiliar_contable">Auxiliar Contable</option>
                        <option value="gerente_rh">Gerente de Recursos Humanos</option>
                        <option value="desarrollador">Desarrollador de Sistemas</option>
                        <option value="contador_general">Contador General</option>
                        <option value="secretaria">Secretario/a Ejecutivo/a</option>
                      </select>
                    </div>
                    <div className="profile-item">
                      <p className="text-label">Departamento</p>
                      <select
                        className="form-input"
                        value={editData.departamento}
                        onChange={(e) => setEditData({...editData, departamento: e.target.value})}
                      >
                        <option value="">Seleccionar departamento</option>
                        <option value="Recursos Humanos">Recursos Humanos</option>
                        <option value="Contabilidad">Contabilidad</option>
                        <option value="Finanzas">Finanzas</option>
                        <option value="Tecnologia">Tecnología</option>
                        <option value="Operaciones">Operaciones</option>
                        <option value="Marketing">Marketing</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-6 btn-group">
                    <button className="btn btn-primary" onClick={handleSave}>
                      Guardar Cambios
                    </button>
                    <button className="btn btn-secondary" onClick={handleCancel}>
                      Cancelar
                    </button>
                    <button className="btn btn-danger" onClick={handleDelete}>
                      Eliminar Perfil
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payroll Section */}
        {activeSection === 'nomina' && (
          <div className="mb-8 nomina-section">
            <h2>Nómina</h2>
            
            {/* Desprendibles de Pago */}
            <div className="expandible-container">
              <div className="expandible-header" onClick={() => {
                const content = document.getElementById('content-desprendibles');
                content.classList.toggle('show');
              }}>
                <div className="expandible-header-content">
                  <p className="expandible-header-title">Desprendibles de Pago</p>
                  <p className="expandible-header-desc">Consulta y descarga tus desprendibles de pago</p>
                </div>
                <button className="btn btn-secondary btn-sm">Ver</button>
              </div>
              <div id="content-desprendibles" className="expandible-content">
                <div className="payslip-item">
                  <div className="payslip-info">
                    <p className="payslip-info-title">Marzo 2026</p>
                    <p className="payslip-info-date">Fecha: 31/03/2026</p>
                  </div>
                  <div className="payslip-amount">
                    <p className="payslip-amount-value">$3,250.00</p>
                    <button className="btn btn-secondary payslip-button">Ver PDF</button>
                  </div>
                </div>
                <div className="payslip-item">
                  <div className="payslip-info">
                    <p className="payslip-info-title">Febrero 2026</p>
                    <p className="payslip-info-date">Fecha: 28/02/2026</p>
                  </div>
                  <div className="payslip-amount">
                    <p className="payslip-amount-value">$3,250.00</p>
                    <button className="btn btn-secondary payslip-button">Ver PDF</button>
                  </div>
                </div>
                <div className="payslip-item">
                  <div className="payslip-info">
                    <p className="payslip-info-title">Enero 2026</p>
                    <p className="payslip-info-date">Fecha: 31/01/2026</p>
                  </div>
                  <div className="payslip-amount">
                    <p className="payslip-amount-value">$3,250.00</p>
                    <button className="btn btn-secondary payslip-button">Ver PDF</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Historial de Pagos */}
            <div className="expandible-container">
              <div className="expandible-header" onClick={() => {
                const content = document.getElementById('content-historial');
                content.classList.toggle('show');
              }}>
                <div className="expandible-header-content">
                  <p className="expandible-header-title">Historial de Pagos</p>
                  <p className="expandible-header-desc">Revisa tu historial de pagos</p>
                </div>
                <button className="btn btn-secondary btn-sm">Ver</button>
              </div>
              <div id="content-historial" className="expandible-content">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Periodo</th>
                      <th>Fecha</th>
                      <th>Monto</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Marzo 2026</td>
                      <td className="date">31/03/2026</td>
                      <td className="amount">$3,250.00</td>
                      <td><span className="badge badge-success">Pagado</span></td>
                    </tr>
                    <tr>
                      <td>Febrero 2026</td>
                      <td className="date">28/02/2026</td>
                      <td className="amount">$3,250.00</td>
                      <td><span className="badge badge-success">Pagado</span></td>
                    </tr>
                    <tr>
                      <td>Enero 2026</td>
                      <td className="date">31/01/2026</td>
                      <td className="amount">$3,250.00</td>
                      <td><span className="badge badge-success">Pagado</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Requests Section */}
        {activeSection === 'solicitudes' && (
          <div className="mb-8">
            <h2>Solicitudes</h2>
            <div className="action-list">
              <div className="action-item">
                <div className="action-content">
                  <div className="icon-box">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256"><path d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Z"></path></svg>
                  </div>
                  <div>
                    <p className="action-title">Vacaciones</p>
                    <p className="action-desc">Solicita tus vacaciones</p>
                  </div>
                </div>
                <button className="btn btn-secondary" onClick={() => setShowRequestForm('vacaciones')}>
                  Solicitar
                </button>
              </div>

              <div className="action-item">
                <div className="action-content">
                  <div className="icon-box">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256"><path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V176a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Z"></path></svg>
                  </div>
                  <div>
                    <p className="action-title">Permisos</p>
                    <p className="action-desc">Solicita permisos</p>
                  </div>
                </div>
                <button className="btn btn-secondary" onClick={() => setShowRequestForm('permisos')}>
                  Solicitar
                </button>
              </div>

              <div className="action-item">
                <div className="action-content">
                  <div className="icon-box">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256"><path d="M184.57,128l27.71-27.72a40,40,0,1,0-56.56-56.56L128,71.43,100.28,43.72a40,40,0,1,0-56.56,56.56L71.43,128,43.72,155.72a40,40,0,1,0,56.56,56.56L128,184.57l27.72,27.71a40,40,0,1,0,56.56-56.56Z"></path></svg>
                  </div>
                  <div>
                    <p className="action-title">Incapacidad</p>
                    <p className="action-desc">Reporta tu incapacidad</p>
                  </div>
                </div>
                <button className="btn btn-secondary" onClick={() => setShowRequestForm('incapacidad')}>
                  Reportar
                </button>
              </div>
            </div>

            {showRequestForm && (
              <div className="card mt-6">
                <h3>Solicitar {showRequestForm.charAt(0).toUpperCase() + showRequestForm.slice(1)}</h3>
                <div className="form-group mt-6">
                  <label>Fecha de Inicio</label>
                  <input
                    type="date"
                    className="form-input"
                    onChange={(e) => setRequestFormData({...requestFormData, fechaInicio: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Fecha de Fin</label>
                  <input
                    type="date"
                    className="form-input"
                    onChange={(e) => setRequestFormData({...requestFormData, fechaFin: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Motivo</label>
                  <textarea
                    className="form-input"
                    rows="3"
                    onChange={(e) => setRequestFormData({...requestFormData, motivo: e.target.value})}
                  ></textarea>
                </div>
                <div className="btn-group">
                  <button className="btn btn-primary" onClick={() => handleSubmitRequest(showRequestForm)}>
                    Enviar Solicitud
                  </button>
                  <button className="btn btn-secondary" onClick={() => { setShowRequestForm(null); setRequestFormData({}); }}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {requests.length > 0 && (
              <div className="card mt-6">
                <h3>Mis Solicitudes</h3>
                <table className="table mt-6">
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Fecha Inicio</th>
                      <th>Fecha Fin</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req.id}>
                        <td>{req.tipoSolicitud}</td>
                        <td>{req.fechaInicio}</td>
                        <td>{req.fechaFin}</td>
                        <td>
                          <span className={`badge ${req.estado === 'aprobada' ? 'badge-success' : req.estado === 'rechazada' ? 'badge-danger' : 'badge-warning'}`}>
                            {req.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Attendance Section */}
        {activeSection === 'asistencia' && (
          <div className="mb-8 asistencia-section">
            <h2>Asistencia</h2>
            <div className="expandible-container">
              <div className="expandible-header" onClick={() => {
                const content = document.getElementById('content-registro-asistencia');
                content.classList.toggle('show');
              }}>
                <div className="expandible-header-content">
                  <p className="expandible-header-title">Registro de Asistencia</p>
                  <p className="expandible-header-desc">Registra tu entrada y salida</p>
                </div>
                <button className="btn btn-secondary btn-sm">Ver</button>
              </div>
              <div id="content-registro-asistencia" className="expandible-content">
                <div className="asistencia-action">
                  <p className="asistencia-action-title">Estado de asistencia</p>
                  <p className="asistencia-action-desc">Registra tu entrada o salida del día</p>
                  <button className="btn btn-primary" onClick={handleRegisterAttendance}>
                    Registrar Entrada/Salida
                  </button>
                </div>
              </div>
            </div>

            <div className="expandible-container">
              <div className="expandible-header" onClick={() => {
                const content = document.getElementById('content-historial-asistencia');
                content.classList.toggle('show');
              }}>
                <div className="expandible-header-content">
                  <p className="expandible-header-title">Historial de Asistencia</p>
                  <p className="expandible-header-desc">Revisa tu historial de entrada y salida</p>
                </div>
                <button className="btn btn-secondary btn-sm">Ver</button>
              </div>
              <div id="content-historial-asistencia" className="expandible-content">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Hora Entrada</th>
                      <th>Hora Salida</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.length > 0 ? (
                      attendance.map((a) => (
                        <tr key={a.id}>
                          <td>{a.fecha}</td>
                          <td>{a.horaEntrada || '-'}</td>
                          <td>{a.horaSalida || '-'}</td>
                          <td>
                            <span className="badge badge-success">{a.estado || 'presente'}</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">No hay registros</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Section */}
        {activeSection === 'notificaciones' && (
          <div className="mb-8">
            <h2>Notificaciones</h2>
            <div className="notification-list">
              <div className="notification-item">
                <div className="notification-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34Z"></path></svg>
                </div>
                <div className="notification-content">
                  <p className="notification-title">Pago procesado</p>
                  <p className="notification-desc">Tu pago ha sido procesado exitosamente.</p>
                  <p className="notification-time">Hace 2 horas</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        {activeSection === 'ayuda' && (
          <div className="mb-8">
            <h2>Ayuda y Soporte</h2>
            <div className="action-list">
              <div className="action-item">
                <div className="action-content">
                  <div className="icon-box">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256"><path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path></svg>
                  </div>
                  <div>
                    <p className="action-title">FAQ</p>
                    <p className="action-desc">Preguntas frecuentes</p>
                  </div>
                </div>
                <button className="btn btn-secondary">Ver</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EmployeeDashboard;

