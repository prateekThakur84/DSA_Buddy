// src/layouts/AuthLayout.jsx
import { Outlet } from 'react-router';
export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
      <Outlet />
    </div>
  );
}
