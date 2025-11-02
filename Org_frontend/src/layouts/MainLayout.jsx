// src/layouts/MainLayout.jsx
import Navigation from '../components/Navigation/Navigation';
import { Outlet } from 'react-router';
import { useSelector } from 'react-redux';

export default function MainLayout() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const hideNavOn = ['/'];
  const { pathname } = window.location;
  
  const showNav = isAuthenticated || !hideNavOn.includes(pathname);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {showNav && <Navigation />}
      <Outlet />
    </div>
  );
}
