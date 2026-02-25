import { Link, NavLink } from "react-router-dom";
import { FiHeart, FiUser, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import { useSelector } from "react-redux";
import logo from "../assets/logo.png";

export default function UserNavbar() {
  const [open, setOpen] = useState(false);
  const role = localStorage.getItem("role");
  const userEmail = localStorage.getItem("user_email");
  const isLoggedIn = role !== null; // vrai si admin ou user

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("user_email");
    window.location.href = "/";
  };

  // ✅ récupérer les favoris depuis redux
  const favoritesCount = useSelector(
    (state) => state.wishlist?.favorites?.length || 0
  );

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-100">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-24">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-4">
            <img src={logo} alt="Logo" className="h-9 w-auto" />
            <span className="text-xl font-light tracking-[0.5em] text-[#C3091C] uppercase">
              Homy
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-14">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-[11px] tracking-[0.4em] uppercase font-light transition-all duration-500 hover:text-[#C3091C] ${isActive ? "text-[#C3091C]" : "text-gray-400"
                }`
              }
            >
              Accueil
            </NavLink>

            <NavLink
              to="/maisons"
              className={({ isActive }) =>
                `text-[11px] tracking-[0.4em] uppercase font-light transition-all duration-500 hover:text-[#C3091C] ${isActive ? "text-[#C3091C]" : "text-gray-400"
                }`
              }
            >
              Maisons
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-[11px] tracking-[0.4em] uppercase font-light transition-all duration-500 hover:text-[#C3091C] ${isActive ? "text-[#C3091C]" : "text-gray-400"
                }`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-10">

            {/* ❤️ Favoris avec compteur */}
            <Link to="/favoris" className="relative text-gray-300 hover:text-[#C3091C] transition-all">
              <FiHeart size={18} strokeWidth={1} />

              {favoritesCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#C3091C] text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {isLoggedIn && (
              <div className="flex items-center gap-10">
                <button
                  onClick={handleLogout}
                  className="px-8 py-2.5 border border-[#C3091C] text-[#C3091C] rounded-full text-[10px] tracking-[0.3em] font-light uppercase hover:bg-[#C3091C] hover:text-white transition-all duration-500"
                >
                  Déconnexion
                </button>
              </div>
            )}

            {!isLoggedIn && (
              <Link
                to="/admin/login"
                className="px-8 py-2.5 border border-[#C3091C] text-[#C3091C] rounded-full text-[10px] tracking-[0.3em] font-light uppercase hover:bg-[#C3091C] hover:text-white transition-all duration-500"
              >
                Connexion
              </Link>
            )}

          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-400 cursor-pointer"
          >
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white h-screen absolute w-full left-0 border-t border-gray-50 flex flex-col items-center pt-20 gap-10">
          <NavLink to="/" onClick={() => setOpen(false)} className="text-[11px] tracking-[0.4em] uppercase text-gray-400">Accueil</NavLink>
          <NavLink to="/maisons" onClick={() => setOpen(false)} className="text-[11px] tracking-[0.4em] uppercase text-gray-400">Maisons</NavLink>
          <NavLink to="/contact" onClick={() => setOpen(false)} className="text-[11px] tracking-[0.4em] uppercase text-gray-400">Contact</NavLink>
          <NavLink to="/favoris" onClick={() => setOpen(false)} className="text-[11px] tracking-[0.4em] uppercase text-gray-400">Ma Wishlist ({favoritesCount})</NavLink>

          {isLoggedIn ? (
            <div className="flex flex-col items-center gap-4 mt-10">
              <span className="text-[9px] text-gray-400 uppercase tracking-widest">{userEmail}</span>
              <button
                onClick={handleLogout}
                className="px-10 py-3 bg-[#C3091C] text-white rounded-full text-[10px] tracking-[0.3em] font-bold"
              >
                DÉCONNEXION
              </button>
            </div>
          ) : (
            <Link
              to="/admin/login"
              onClick={() => setOpen(false)}
              className="mt-10 px-10 py-3 bg-[#C3091C] text-white rounded-full text-[10px] tracking-[0.3em] font-bold"
            >
              CONNEXION
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
