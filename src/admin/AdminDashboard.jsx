import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar onLogout={() => {}} />

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