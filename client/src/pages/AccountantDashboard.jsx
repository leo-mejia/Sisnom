import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEmployees } from '../services/api';

const AccountantDashboard = () => {
  const { logout: authLogout } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const empData = await getEmployees();
      setEmployees(empData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
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
    payroll: '<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256"><path d="M152,120H136V56h8a32,32,0,0,1,32,32,8,8,0,0,0,16,0,48.05,48.05,0,0,0-48-48h-8V24a8,8,0,0,0-16,0V40h-8a48,48,0,0,0,0,96h8v64H104a32,32,0,0,1-32-32,8,8,0,0,0-16,0,48.05,48.05,0,0,0,48,48h16v16a8,8,0,0,0,16,0V216h16a48,48,0,0,0,0-96Z"></path></svg>',
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
              <span>CO</span>
            </div>
            <div className="user-info">
              <h2>Contador</h2>
              <p>Contador</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {renderNavItem('dashboard', icons.dashboard, 'Dashboard')}
          {renderNavItem('nomina', icons.payroll, 'Nómina')}
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
          <h1>Panel del Contador</h1>
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
            <h2>Informes Contables</h2>
            <div className="card">
              <p className="card-description">Módulo de informes contables - En desarrollo</p>
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

export default AccountantDashboard;

