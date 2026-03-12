import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Recovery from './pages/Recovery'
import EmployeeDashboard from './pages/EmployeeDashboard'
import AdminDashboard from './pages/AdminDashboard'
import AccountantDashboard from './pages/AccountantDashboard'
import HRDashboard from './pages/HRDashboard'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recuperar" element={<Recovery />} />
          <Route 
            path="/empleado/*" 
            element={
              <ProtectedRoute allowedRoles={['empleado', 'admin', 'contador', 'recursos_humanos']}>
                <EmployeeDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/contador/*" 
            element={
              <ProtectedRoute allowedRoles={['contador', 'admin']}>
                <AccountantDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/rrhh/*" 
            element={
              <ProtectedRoute allowedRoles={['recursos_humanos', 'admin']}>
                <HRDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

