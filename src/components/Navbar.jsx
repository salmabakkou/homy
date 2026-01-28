import { Link, NavLink } from "react-router-dom";
import { FiHeart, FiUser, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import logo from "../assets/logo.png";

export default function UserNavbar() {
  const [open, setOpen] = useState(false);
  const isLoggedIn = false; 

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-24">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4">
            <img src={logo} alt="Logo" className="h-9 w-auto" />
            <span className="text-xl font-light tracking-[0.5em] text-[#C3091C] uppercase">
              Homy
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-14">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `text-[11px] tracking-[0.4em] uppercase font-light transition-all duration-500 hover:text-[#C3091C] ${isActive ? 'text-[#C3091C]' : 'text-gray-400'}`
              }
            >
              Accueil
            </NavLink>
            <NavLink 
              to="/maisons" 
              className={({ isActive }) => 
                `text-[11px] tracking-[0.4em] uppercase font-light transition-all duration-500 hover:text-[#C3091C] ${isActive ? 'text-[#C3091C]' : 'text-gray-400'}`
              }
            >
              Maisons
            </NavLink>
            <NavLink 
              to="/contact" 
              className={({ isActive }) => 
                `text-[11px] tracking-[0.4em] uppercase font-light transition-all duration-500 hover:text-[#C3091C] ${isActive ? 'text-[#C3091C]' : 'text-gray-400'}`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* actions */}
          <div className="hidden md:flex items-center gap-10">
            <Link to="/favoris" className="text-gray-300 hover:text-[#C3091C] transition-all">
              <FiHeart size={18} strokeWidth={1} />
            </Link>

            {isLoggedIn ? (
              <Link to="/profile" className="flex items-center gap-2 text-gray-400">
                <FiUser size={18} strokeWidth={1} />
                <span className="text-[9px] font-light uppercase tracking-[0.3em]">Profil</span>
              </Link>
            ) : (
              <Link 
                to="/login"
                className="px-8 py-2.5 border border-[#C3091C] text-[#C3091C] rounded-full text-[10px] tracking-[0.3em] font-light uppercase hover:bg-[#C3091C] hover:text-white transition-all duration-500"
              >
                Connexion
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setOpen(!open)} className="md:hidden text-gray-400 cursor-pointer">
            {open ? <FiX size={24} strokeWidth={1} /> : <FiMenu size={24} strokeWidth={1} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white h-screen absolute w-full left-0 border-t border-gray-50 flex flex-col items-center pt-20 gap-10">
          <NavLink to="/" onClick={() => setOpen(false)} className="text-[12px] tracking-[0.5em] font-light uppercase">Accueil</NavLink>
          <NavLink to="/maisons" onClick={() => setOpen(false)} className="text-[12px] tracking-[0.5em] font-light uppercase">Maisons</NavLink>
          <NavLink to="/contact" onClick={() => setOpen(false)} className="text-[12px] tracking-[0.5em] font-light uppercase">Contact</NavLink>
          <Link to="/login" onClick={() => setOpen(false)} className="mt-4 px-10 py-3 bg-[#C3091C] text-white rounded-full text-[10px] tracking-[0.3em] font-bold">CONNEXION</Link>
        </div>
      )}
    </header>
  );
}