import React from 'react';
import { Link } from 'react-router-dom';
import { FiEdit3, FiTrash2, FiHeart, FiMaximize, FiCalendar, FiMapPin, FiArrowUpRight } from 'react-icons/fi';
import { FaBed, FaBath } from 'react-icons/fa'; 
import toast from 'react-hot-toast';

export default function HouseCard({ house, isAdmin = false, onDelete, onEdit }) {
  const primaryRed = "#C3091C";

  return (
    <div className="group bg-white rounded-4xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col aspect-square relative w-full max-w-95">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={house.mainImage}
          alt={house.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent" />
      </div>

      {/* UI ADMIN (Haut Droite) */}
      {isAdmin && (
        <div className="absolute top-3 right-3 flex gap-2 z-20">
          <button
            onClick={() => onEdit(house)}
            className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all shadow-lg"
          >
            <FiEdit3 size={14} />
          </button>
          <button
            onClick={() => onDelete(house.id)}
            className="w-8 h-8 bg-white text-[#C3091C] rounded-full flex items-center justify-center hover:bg-red-50 transition-all shadow-lg"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      )}

      {/* BADGE STATUT */}
      <div className="absolute top-3 left-3 z-20">
        <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase text-white shadow-lg
          ${house.status === 'available' ? 'bg-emerald-500' : 'bg-[#C3091C]'}`}>
          {house.status === 'available' ? 'Libre' : 'Occupé'}
        </span>
      </div>

      {/* CONTENU BAS */}
      <div className="mt-auto p-5 z-10 relative text-white">
        {/* Titre et Prix */}
        <div className="flex justify-between items-end mb-2">
          <div className="flex-1">
            <h2 className="text-lg font-bold leading-tight truncate mr-2 drop-shadow-md">{house.title}</h2>
            <p className="text-white/80 text-[10px] flex items-center gap-1">
              <FiMapPin size={10} style={{ color: primaryRed }} /> {house.address}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xl font-black whitespace-nowrap drop-shadow-md">
              {house.price}<span className="text-[10px] font-light ml-1 text-white/70">MAD</span>
            </span>
          </div>
        </div>

        {/* Caractéristiques */}
        <div className="flex gap-4 mb-4 py-3 border-t border-white/20">
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <FaBed size={13} /> <span>{house.rooms}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <FaBath size={13} /> <span>{house.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <FiMaximize size={13} /> <span>{house.surface}m²</span>
          </div>
        </div>

        {/* SECTION ACTIONS & DATE */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {/* Bouton Détails : Position Fixe */}
            <Link
              to={`/houses/${house.id}`}
              className="flex-1 h-10 bg-white text-black rounded-xl flex items-center justify-center gap-2 text-[10px] font-black tracking-widest uppercase hover:bg-[#C3091C] hover:text-white transition-all duration-300 shadow-lg"
            >
              DÉTAILS <FiArrowUpRight size={14} />
            </Link>

            {/* Bouton Favoris (Seulement si non-admin) */}
            {!isAdmin && (
              <button
                onClick={() => toast.success('Ajouté !')}
                className="w-10 h-10 bg-white text-gray-800 rounded-xl flex items-center justify-center hover:text-[#C3091C] transition-all shadow-lg shrink-0"
              >
                <FiHeart size={18} />
              </button>
            )}
          </div>

          {/* ZONE DATE  */}
          <div className="h-4 flex items-center"> 
            {house.status !== 'available' && (
              <div className="text-[10px] text-white/90 font-bold italic flex items-center gap-1 animate-pulse">
                <FiCalendar size={12} style={{ color: primaryRed }} /> 
                <span>Jusqu'au {house.reservedTo}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}