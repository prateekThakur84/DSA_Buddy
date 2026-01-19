// src/layouts/AuthLayout.jsx
import { Outlet } from 'react-router';

export default function AuthLayout() {
  return (
    // The parent handles the background and vertical centering
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
      {/* This wrapper forces the flex child to be full width */}
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
}