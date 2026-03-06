import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, employerOnly = false }) => {
  const { isAuthenticated, isEmployer, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (employerOnly && !isEmployer) {
    return <Navigate to="/jobs" replace />;
  }

  return children;
};

export default ProtectedRoute;