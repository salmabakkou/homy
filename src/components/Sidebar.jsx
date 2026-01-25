import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiPlus, FiCalendar, FiLogOut } from 'react-icons/fi';
import logo from '../assets/logo.png';

export default function Sidebar({ onLogout }) {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: <FiHome size={22} /> },
    { name: 'Ajouter une maison', href: '/admin/addHouse', icon: <FiPlus size={22} /> },
    { name: 'Réservations', href: '/admin/reservations', icon: <FiCalendar size={22} /> },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <div className="fixed top-0 left-0 w-48 h-screen bg-white border-r border-gray-200 shadow-md flex flex-col z-50">
      
      {/* Logo */}
      <Link
        to="/admin"
        className="flex items-center p-3 border-b border-gray-200 cursor-pointer hover:opacity-80"
      >
        <img src={logo} alt="Homy Logo" className="w-8 h-8 mr-2" />
        <span className="text-2xl font-bold text-[#C3091C] font-playfair">Homy</span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col p-3 space-y-5">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex flex-col items-center py-3 rounded-lg transition-colors cursor-pointer ${
              isActive(item.href)
                ? 'bg-[#C3091C] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {item.icon}
            <span className="mt-1 text-sm font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="flex items-center justify-start space-x-2 w-full px-3 py-2 rounded-lg bg-white text-gray-900 font-medium hover:bg-gray-100 cursor-pointer transition-colors"
        >
          <FiLogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
