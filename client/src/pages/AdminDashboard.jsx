import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEmployees, updateEmployeeStatus, getPendingRequests, updateRequestStatus } from '../services/api';

const AdminDashboard = () => {
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
      const [empData, reqData] = await Promise.all([
        getEmployees(),
        getPendingRequests()
      ]);
      setEmployees(empData || []);
      setPendingRequests(reqData || []);
    } catch (error) {
      console.error('Error loading data:', error);
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
    employees: '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256"><path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87a8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path></svg>',
    payroll: '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256"><path d="M152,120H136V56h8a32,32,0,0,1,32,32,8,8,0,0,0,16,0,48.05,48.05,0,0,0-48-48h-8V24a8,8,0,0,0-16,0V40h-8a48,48,0,0,0,0,96h8v64H104a32,32,0,0,1-32-32,8,8,0,0,0-16,0,48.05,48.05,0,0,0,48,48h16v16a8,8,0,0,0,16,0V216h16a48,48,0,0,0,0-96Z"></path></svg>',
    reports: '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256"><path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Z"></path></svg>',
    system: '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256"><path d="M216,130.16q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.6,107.6,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.29,107.29,0,0,0-26.25-10.86,8,8,0,0,0-7.06,1.48L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.6,107.6,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Z"></path></svg>',
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
              <span>AD</span>
            </div>
            <div className="user-info">
              <h2>Administrador</h2>
              <p>Admin</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {renderNavItem('dashboard', icons.dashboard, 'Dashboard')}
          {renderNavItem('empleados', icons.employees, 'Empleados')}
          {renderNavItem('nomina', icons.payroll, 'Nómina')}
          {renderNavItem('informes', icons.reports, 'Informes')}
          {renderNavItem('sistema', icons.system, 'Sistema')}
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
          <h1>Panel de Administrador</h1>
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

        {/* Payroll */}
        {activeSection === 'nomina' && (
          <div className="mb-8">
            <h2>Gestión de Nómina</h2>
            <div className="card">
              <p className="card-description">Módulo de gestión de nómina - En desarrollo</p>
            </div>
          </div>
        )}

        {/* Reports */}
        {activeSection === 'informes' && (
          <div className="mb-8">
            <h2>Informes</h2>
            <div className="card">
              <p className="card-description">Módulo de informes - En desarrollo</p>
            </div>
          </div>
        )}

        {/* System */}
        {activeSection === 'sistema' && (
          <div className="mb-8">
            <h2>Gestión del Sistema</h2>
            <div className="cards-grid">
              <div className="info-card">
                <div className="card-header">
                  <div className="card-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M240,208H224V96a16,16,0,0,0-16-16H144V32a16,16,0,0,0-24.88-13.32L39.12,72A16,16,0,0,0,32,85.34V208H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16Z"></path></svg>
                  </div>
                  <h3 className="card-title">Configuración de la empresa</h3>
                </div>
                <p className="card-description">Configura los detalles de tu empresa</p>
              </div>
              <div className="info-card">
                <div className="card-header">
                  <div className="card-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,0-6.22A8,8,0,0,1,192,112a24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4Z"></path></svg>
                  </div>
                  <h3 className="card-title">Roles y permisos</h3>
                </div>
                <p className="card-description">Define roles y permisos de usuarios</p>
              </div>
              <div className="info-card">
                <div className="card-header">
                  <div className="card-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Z"></path></svg>
                  </div>
                  <h3 className="card-title">Seguridad y auditoría</h3>
                </div>
                <p className="card-description">Supervisa la actividad del sistema</p>
              </div>
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

export default AdminDashboard;

