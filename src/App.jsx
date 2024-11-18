import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './components/auth/AuthContext'
import { LoanProvider } from './components/loan/LoanContext'
import { RegisterForm } from './components/auth/RegisterForm'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { UserProfile } from './components/auth/UserProfile'
import { AuthLayout } from './components/auth/AuthLayout'
import { UserDashboard } from './components/auth/UserDashboard'
import { AdminDashboard } from './components/admin/AdminDashboard'
import WelcomeDashboard from './components/auth/WelcomeDashboard'

// Dashboard Route Component
const DashboardRoute = () => {
  const { user } = useAuth()
  
  // Redirect admin users to admin dashboard
  if (user?.is_admin) {
    return <Navigate to="/admin" replace />
  }
  
  return <UserDashboard />
}

// Admin Protected Route (only for users with is_admin flag)
const AdminProtectedRoute = ({ children }) => {
  const { user } = useAuth()

  if (!user || !user.is_admin) {
    // Redirect non-admin users to the dashboard or login page
    return <Navigate to="/dashboard" />
  }

  return children
}

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <LoanProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<WelcomeDashboard />} />
            <Route path="/register" element={
              <AuthLayout>
                <RegisterForm />
              </AuthLayout>
            } />

            {/* Dashboard Route - will redirect admins to /admin */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardRoute />
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />

            {/* Admin Route (Protected) */}
            <Route path="/admin" element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            } />
          </Routes>
        </LoanProvider>
      </AuthProvider>
    </Router>
  )
}

export default App