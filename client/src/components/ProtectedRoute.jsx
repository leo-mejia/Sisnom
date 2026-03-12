import { Navigate } from 'react-router-dom';
import { getToken, getRole } from '../services/api';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = getToken();
  const rol = getRole();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(rol)) {
    // Redirect to appropriate dashboard based on role
    switch (rol) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'contador':
        return <Navigate to="/contador" replace />;
      case 'recursos_humanos':
        return <Navigate to="/rrhh" replace />;
      default:
        return <Navigate to="/empleado" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

