// src/components/RouteGuards/PrivateRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

export default function PrivateRoute({ Component }) {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
}
