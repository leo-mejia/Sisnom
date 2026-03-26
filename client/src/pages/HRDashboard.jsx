import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEmployees, updateEmployeeStatus, getPendingRequests, updateRequestStatus, getEmployeeAttendance } from '../services/api';

const HRDashboard = () => {
  const { logout: authLogout } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [employees, setEmployees] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('Loading HR data...');
      const [empData, reqData] = await Promise.all([
        getEmployees(),
        getPendingRequests()
      ]);
      setEmployees(empData || []);
      setPendingRequests(reqData || []);
      console.log('Loaded employees:', empData?.length || 0);
    } catch (error) {
      console.error('Error loading HR data:', error);
      alert('Error cargando datos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const result = await updateEmployeeStatus(id, newStatus);
      if (result.success) {
        alert('Estado actualizado');
        loadData();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleRequestStatus = async (id, estado) => {
    try {
      const result = await updateRequestStatus(id, estado);
      if (result.success) {
        alert('Solicitud actualizada');
        loadData();
      }
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  const handleLogout = () => {
    authLogout();
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
    dashboard: '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256"><path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77Z"></path></svg>',
    employees: '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256"><path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92Z"></path></svg>',
    requests: '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256"><path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34Z"></path></svg>',
    attendance: '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z"></path></svg>',
    reports: '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256"><path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Z"></path></svg>',
    help: '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256"><path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Z"></path></svg>',
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
              <span>RH</span>
            </div>
            <div className="user-info">
              <h2>Recursos Humanos</h2>
              <p>RRHH</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {renderNavItem('dashboard', icons.dashboard, 'Dashboard')}
          {renderNavItem('empleados', icons.employees, 'Empleados')}
          {renderNavItem('solicitudes', icons.requests, 'Solicitudes')}
          {renderNavItem('asistencia', icons.attendance, 'Asistencia')}
          {renderNavItem('informes', icons.reports, 'Informes')}
          {renderNavItem('ayuda', icons.help, 'Ayuda')}
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
          <h1>Panel de Recursos Humanos</h1>
        </div>

        {/* Dashboard */}
        {activeSection === 'dashboard' && (
          <div className="mb-8">
            <h2>Resumen</h2>
            <div className="cards-grid">
              <div className="info-card">
                <div className="card-header">
                  <div className="card-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92Z"></path></svg>
                  </div>
                  <h3 className="card-title">Total Empleados</h3>
                </div>
                <p className="card-description">{employees.length}</p>
              </div>
              <div className="info-card">
                <div className="card-header">
                  <div className="card-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34Z"></path></svg>
                  </div>
                  <h3 className="card-title">Solicitudes Pendientes</h3>
                </div>
                <p className="card-description">{pendingRequests.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Employees */}
        {activeSection === 'empleados' && (
          <div className="mb-8">
            <h2>Gestión de Empleados</h2>
            <div className="card">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Documento</th>
                    <th>Cargo</th>
                    <th>Departamento</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.length > 0 ? (
                    employees.map((emp) => (
                      <tr key={emp.id}>
                        <td>{emp.nombres} {emp.apellidos}</td>
                        <td>{emp.tipoDocumento} {emp.numeroDocumento}</td>
                        <td>{emp.cargo || 'N/A'}</td>
                        <td>{emp.departamento || 'N/A'}</td>
                        <td>
                          <span className={`badge ${emp.estado === 'activo' ? 'badge-success' : 'badge-danger'}`}>
                            {emp.estado}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-secondary"
                            onClick={() => handleStatusChange(emp.id, emp.estado === 'activo' ? 'inactivo' : 'activo')}
                          >
                            {emp.estado === 'activo' ? 'Desactivar' : 'Activar'}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">No hay empleados</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Requests */}
        {activeSection === 'solicitudes' && (
          <div className="mb-8">
            <h2>Solicitudes de Empleados</h2>
            <div className="card">
              {pendingRequests.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Tipo</th>
                      <th>Fecha Inicio</th>
                      <th>Fecha Fin</th>
                      <th>Motivo</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRequests.map((req) => (
                      <tr key={req.id}>
                         {req.usuarioNombre ||
                    req.nombreUsuario ||
                    req.empleadoNombre ||
                    req.usuario?.nombre ||
                    `${req.usuario?.nombres || ''} ${req.usuario?.apellidos || ''}`.trim() ||
                    `${req.nombres || ''} ${req.apellidos || ''}`.trim() ||
                    'Usuario no disponible'}
                        <td>{req.tipoSolicitud}</td>
                        <td>{req.fechaInicio}</td>
                        <td>{req.fechaFin}</td>
                        <td>{req.motivo || 'Sin motivo'}</td>
                        <td>
                          <button 
                            className="btn btn-primary"
                            style={{ marginRight: '8px' }}
                            onClick={() => handleRequestStatus(req.id, 'aprobada')}
                          >
                            Aprobar
                          </button>
                          <button 
                            className="btn btn-danger"
                            onClick={() => handleRequestStatus(req.id, 'rechazada')}
                          >
                            Rechazar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="card-description">No hay solicitudes pendientes</p>
              )}
            </div>
          </div>
        )}

        {/* Attendance */}
        {activeSection === 'asistencia' && (
          <div className="mb-8">
            <h2>Control de Asistencia</h2>
            <div className="card">
              <p className="card-description">Ver historial de asistencia de empleados</p>
            </div>
          </div>
        )}

        {/* Reports */}
        {activeSection === 'informes' && (
          <div className="mb-8">
            <h2>Informes de RRHH</h2>
            <div className="card">
              <p className="card-description">Módulo de informes - En desarrollo</p>
            </div>
          </div>
        )}

        {/* Help */}
        {activeSection === 'ayuda' && (
          <div className="mb-8">
            <h2>Ayuda y Soporte</h2>
            <div className="card">
              <p className="card-description">¿Necesitas ayuda? Contacta al administrador del sistema.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HRDashboard;

