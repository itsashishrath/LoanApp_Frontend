// components/admin/AdminRoute.jsx
import { useAuth } from '../auth/AuthContext';
import { Navigate } from 'react-router-dom';

export const AdminRoute = ({ children }) => {
  const { user, tokens } = useAuth();

  if (!tokens || !user) {
    // If no tokens or user, don't redirect prematurely
    return <div>Loading...</div>; // Or a loading spinner if preferred
  }

  if (!user?.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
