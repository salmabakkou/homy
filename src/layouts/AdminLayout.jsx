import React from 'react';
import Sidebar from '../components/Sidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 relative">

      {/* SIDEBAR */}
      <Sidebar />

      {/* WRAPPER CONTENU */}
      <div
        className="
          pt-6
          px-4
          lg:pl-64   /* PLUS SAFE QUE ml-60 */
          transition-all
        "
      >
        <div className="w-full max-w-7xl mx-auto">
          {children}
        </div>
      </div>

    </div>
  );
}
