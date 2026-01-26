import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiPlus, FiCalendar, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import logo from '../assets/logo.png';

export default function Sidebar({ onLogout }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Tableau de bord', href: '/admin', icon: <FiHome size={18} /> },
    { name: 'Ajouter une maison', href: '/admin/addHouse', icon: <FiPlus size={18} /> },
    { name: 'Réservations', href: '/admin/reservations', icon: <FiCalendar size={18} /> },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <>
      {/* BOUTON MOBILE */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-3 left-3 z-60 p-2 bg-white rounded-md shadow-sm border border-gray-100 text-[#C3091C]"
      >
        {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {/* OVERLAY MOBILE */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* SIDEBAR */}
      <div className={`
        fixed top-0 left-0 h-screen bg-white z-50 transition-all duration-300 flex flex-col
        /* ICI : La ligne et l'ombre qui marquent la séparation avec la page */
        border-r border-gray-200 shadow-[4px_0_15px_rgba(0,0,0,0.04)]
        ${isOpen ? 'w-60 translate-x-0' : 'w-60 -translate-x-full lg:translate-x-0'} 
      `}>
        
        {/* LOGO & HOMY STYLE ÉDITORIAL */}
        <div className="py-8 px-6 border-b border-gray-50">
          <Link to="/admin" className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-7 h-7 object-contain" />
            <div className="flex flex-col">
              <span className="text-xl font-serif tracking-[0.15em] text-[#C3091C] leading-none uppercase">
                Homy
              </span>
              <span className="text-[9px] text-gray-400 font-bold tracking-[0.2em] mt-1 italic uppercase">
                Administration
              </span>
            </div>
          </Link>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 p-4 space-y-1 mt-4 overflow-y-auto">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive(item.href)
                  ? 'bg-[#C3091C] text-white shadow-sm font-bold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className={`${isActive(item.href) ? 'text-white' : 'text-[#C3091C]'}`}>
                {item.icon}
              </div>
              <span className="text-[13px] tracking-tight italic">
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        {/* DÉCONNEXION - mt-auto le force vers le bas */}
        <div className="p-4 border-t border-gray-100 mt-auto bg-gray-50/30">
          <button
            onClick={onLogout}
            className="flex items-center space-x-3 w-full px-4 py-2.5 rounded-lg text-gray-500 text-[11px] font-bold hover:bg-red-50 hover:text-[#C3091C] transition-all tracking-widest"
          >
            <FiLogOut size={16} />
            <span>DÉCONNEXION</span>
          </button>
        </div>
      </div>
    </>
  );
}