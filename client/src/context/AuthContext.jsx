import { createContext, useContext, useState, useEffect } from 'react';
import { getToken, getRole, login as apiLogin } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const rol = getRole();
    if (token) {
      setUser({ token, rol });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await apiLogin(email, password);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('rol', response.rol);
      localStorage.setItem('email', email);
      setUser({ token: response.token, rol: response.rol });
      return { success: true };
    }
    return { success: false, message: response.message || 'Error en el inicio de sesión' };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('email');
    setUser(null);
    window.location.href = '/login';
  };

  const getDashboardUrl = () => {
    const rol = getRole();
    switch (rol) {
      case 'admin':
        return '/admin';
      case 'contador':
        return '/contador';
      case 'recursos_humanos':
        return '/rrhh';
      default:
        return '/empleado';
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, getDashboardUrl }}>
      {children}
    </AuthContext.Provider>
  );
};

