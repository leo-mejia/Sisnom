const API_BASE = '/api';

export const getToken = () => localStorage.getItem('token');

export const getRole = () => localStorage.getItem('rol');

const authenticatedFetch = async (url, options = {}) => {
  const token = getToken();
  if (!token) {
    window.location.href = '/login';
    return null;
  }

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const response = await fetch(`${API_BASE}${url}`, { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('email');
    window.location.href = '/login';
    return null;
  }

  return response;
};

// Auth API (public)
export const login = async (email, password) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};

export const register = async (userData) => {
  const response = await fetch(`${API_BASE}/auth/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
};

// Profile API
export const getProfile = async () => {
  const response = await authenticatedFetch('/perfil');
  if (!response) return null;
  return response.json();
};

export const updateProfile = async (data) => {
  const response = await authenticatedFetch('/perfil', {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  return response.json();
};

export const deleteProfile = async () => {
  const response = await authenticatedFetch('/perfil', {
    method: 'DELETE'
  });
  return response.json();
};

// Employee API
export const getEmployees = async () => {
  const response = await authenticatedFetch('/empleados');
  if (!response) return [];
  return response.json();
};

export const getEmployee = async (id) => {
  const response = await authenticatedFetch(`/empleados/${id}`);
  if (!response) return null;
  return response.json();
};

export const updateEmployeeStatus = async (id, estado) => {
  const response = await authenticatedFetch(`/empleados/${id}/estado`, {
    method: 'PUT',
    body: JSON.stringify({ estado })
  });
  return response.json();
};

// Attendance API
export const registerEntry = async () => {
  const response = await authenticatedFetch('/asistencia/entrada', {
    method: 'POST'
  });
  return response.json();
};

export const registerExit = async (id) => {
  const response = await authenticatedFetch(`/asistencia/salida/${id}`, {
    method: 'POST'
  });
  return response.json();
};

export const getMyAttendance = async () => {
  const response = await authenticatedFetch('/asistencia/mi-asistencia');
  if (!response) return [];
  return response.json();
};

export const getEmployeeAttendance = async (id) => {
  const response = await authenticatedFetch(`/asistencia/empleado/${id}`);
  if (!response) return [];
  return response.json();
};

// Requests API
export const getMyRequests = async () => {
  const response = await authenticatedFetch('/solicitudes/mis-solicitudes');
  if (!response) return [];
  return response.json();
};

export const createRequest = async (data) => {
  const response = await authenticatedFetch('/solicitudes', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return response.json();
};

export const getPendingRequests = async () => {
  const response = await authenticatedFetch('/solicitudes/pendientes');
  if (!response) return [];
  return response.json();
};

export const updateRequestStatus = async (id, estado) => {
  const response = await authenticatedFetch(`/solicitudes/${id}/estado`, {
    method: 'PUT',
    body: JSON.stringify({ estado })
  });
  return response.json();
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('rol');
  localStorage.removeItem('email');
  window.location.href = '/login';
};

export default {
  getToken,
  getRole,
  login,
  register,
  getProfile,
  updateProfile,
  deleteProfile,
  getEmployees,
  getEmployee,
  updateEmployeeStatus,
  registerEntry,
  registerExit,
  getMyAttendance,
  getEmployeeAttendance,
  getMyRequests,
  createRequest,
  getPendingRequests,
  updateRequestStatus,
  logout
};

