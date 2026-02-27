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
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 md:gap-4">
            <img src={logo} alt="Logo" className="h-7 md:h-9 w-auto" />
            <span className="text-xl md:text-2xl font-serif tracking-[0.2em] md:tracking-[0.3em] text-[#EB2411] uppercase">
              Homy
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-14">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-[10px] tracking-[0.4em] uppercase font-bold transition-all duration-500 hover:text-[#EB2411] ${isActive ? "text-[#EB2411]" : "text-gray-500"}`
              }
            >
              Accueil
            </NavLink>

            <NavLink
              to="/maisons"
              className={({ isActive }) =>
                `text-[10px] tracking-[0.4em] uppercase font-bold transition-all duration-500 hover:text-[#EB2411] ${isActive ? "text-[#EB2411]" : "text-gray-500"}`
              }
            >
              Maisons
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-[10px] tracking-[0.4em] uppercase font-bold transition-all duration-500 hover:text-[#EB2411] ${isActive ? "text-[#EB2411]" : "text-gray-500"}`
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
                  className="px-8 py-2.5 border border-[#EB2411] text-[#EB2411] rounded-full text-[9px] tracking-[0.3em] font-black uppercase hover:bg-[#EB2411] hover:text-white transition-all duration-500 shadow-sm"
                >
                  Déconnexion
                </button>
              </div>
            )}

            {!isLoggedIn && (
              <Link
                to="/admin/login"
                className="px-8 py-2.5 border border-[#EB2411] text-[#EB2411] rounded-full text-[9px] tracking-[0.3em] font-black uppercase hover:bg-[#EB2411] hover:text-white transition-all duration-500 shadow-sm"
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
        <div className="md:hidden bg-white fixed inset-x-0 top-20 bottom-0 z-[99] border-t border-gray-50 flex flex-col items-center pt-10 pb-10 gap-8 overflow-y-auto">
          <NavLink to="/" onClick={() => setOpen(false)} className="text-[11px] tracking-[0.4em] uppercase text-gray-400">Accueil</NavLink>
          <NavLink to="/maisons" onClick={() => setOpen(false)} className="text-[11px] tracking-[0.4em] uppercase text-gray-400">Maisons</NavLink>
          <NavLink to="/contact" onClick={() => setOpen(false)} className="text-[11px] tracking-[0.4em] uppercase text-gray-400">Contact</NavLink>
          <NavLink to="/favoris" onClick={() => setOpen(false)} className="text-[11px] tracking-[0.4em] uppercase text-gray-400">Ma Wishlist ({favoritesCount})</NavLink>

          {isLoggedIn ? (
            <div className="flex flex-col items-center gap-4 mt-10">
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
