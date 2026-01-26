import React from 'react';
import Sidebar from '../components/Sidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white md:bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-0 md:p-">
        <div className="w-full max-w-5xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}