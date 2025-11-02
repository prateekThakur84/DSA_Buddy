// src/layouts/AdminLayout.jsx
import Navigation from '../components/Navigation/Navigation';
import { Outlet } from 'react-router';
import { useSelector } from 'react-redux';

export default function AdminLayout() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
      {/* Show the same Navigation bar if admin is authenticated */}
      {isAuthenticated && <Navigation />}

      {/* Main Content */}
      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  );
}
