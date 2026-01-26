import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function AdminDashboard() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      
      <Sidebar onLogout={() => {}} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="p-4 md:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}