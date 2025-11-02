// src/components/RouteGuards/AdminRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

export default function AdminRoute({ Component }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  return (isAuthenticated && user?.role === 'admin') ? <Component /> : <Navigate to="/" />;
}
