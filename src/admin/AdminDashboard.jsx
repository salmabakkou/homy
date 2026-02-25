import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Supprime le rôle stocké
    localStorage.removeItem("role");
    localStorage.removeItem("user_email");

    // Redirige vers la page user
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Passe la fonction handleLogout à Sidebar */}
      <Sidebar onLogout={handleLogout} />

      <div className="lg:pl-60 transition-all duration-300">
        <main className="p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
