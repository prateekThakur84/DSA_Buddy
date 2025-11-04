// src/components/RouteGuards/AdminRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

export default function AdminRoute({ children }) {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  
  // Show loading state while checking auth
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  
  return (isAuthenticated && user?.role === 'admin') ? children : <Navigate to="/" />;
}
