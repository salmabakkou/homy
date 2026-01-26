import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiPlus, FiCalendar, FiLogOut } from 'react-icons/fi';
import logo from '../assets/logo.png';

export default function Sidebar({ onLogout }) {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: <FiHome size={20} /> },
    { name: 'Ajouter maison', href: '/admin/addHouse', icon: <FiPlus size={20} /> },
    { name: 'Réservations', href: '/admin/reservations', icon: <FiCalendar size={20} /> },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <div className="fixed top-0 left-0 w-56 h-screen bg-white border-r border-gray-200 shadow-lg flex flex-col z-50">
      
      {/* LOGO + HOMY  */}
      <Link
        to="/admin"
        className="flex flex-col items-center justify-center py-6 border-b border-gray-200 cursor-pointer hover:opacity-90"
      >
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Homy Logo" className="w-10 h-10" />
          <span className="text-3xl font-semibold tracking-widest text-[#C3091C] font-playfair">
            HOMY
          </span>
        </div>
        <span className="text-xs text-gray-400 mt-1 tracking-[0.3em]">
          ADMIN
        </span>
      </Link>

      {/* NAVIGATION */}
      <nav className="flex-1 flex flex-col p-4 space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
              isActive(item.href)
                ? 'bg-[#C3091C] text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className={`${isActive(item.href) ? 'text-white' : 'text-[#C3091C]'}`}>
              {item.icon}
            </div>
            <span className="text-sm font-medium tracking-wide">
              {item.name}
            </span>
          </Link>
        ))}
      </nav>

      {/* LOGOUT */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl bg-white text-gray-900 font-medium hover:bg-gray-100 cursor-pointer transition-all"
        >
          <FiLogOut size={20} className="text-[#C3091C]" />
          <span className="tracking-wide">Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
