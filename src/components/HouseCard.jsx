import React from 'react';
import { Link } from 'react-router-dom';
import { FiEdit3, FiTrash2, FiHeart, FiMaximize, FiCalendar, FiMapPin, FiArrowUpRight } from 'react-icons/fi';
import { FaBed, FaBath } from 'react-icons/fa'; 
import toast from 'react-hot-toast';

export default function HouseCard({ house, isAdmin = false, onDelete, onEdit }) {
  const primaryRed = "#C3091C";

  return (
    <div className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col relative w-full aspect-square">
    
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={house.mainImage}
          alt={house.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/20 to-transparent" />
      </div>

      {/* UI ADMIN */}
      {isAdmin && (
        <div className="absolute top-4 right-4 flex gap-2 z-20">
          <button
            onClick={(e) => { e.preventDefault(); onEdit(house); }}
            className="w-9 h-9 bg-white/90 backdrop-blur-md text-blue-600 cursor-pointer rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg active:scale-90"
          >
            <FiEdit3 size={16} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); onDelete(house); }}
            className="w-9 h-9 bg-white/90 backdrop-blur-md cursor-pointer rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg active:scale-90"
            style={{ color: primaryRed }} /* UTILISATION ICI */
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      )}

      {/* BADGE STATUT */}
      <div className="absolute top-4 left-4 z-20">
        <span 
          className="px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] uppercase text-white shadow-lg"
          style={{ backgroundColor: house.status === 'available' ? '#10b981' : primaryRed }} /* UTILISATION ICI */
        >
          {house.status === 'available' ? 'Libre' : 'Occupé'}
        </span>
      </div>

      {/* CONTENU BAS */}
      <div className="mt-auto p-5 z-10 relative text-white">
        <div className="mb-3">
          <h2 className="text-lg font-bold leading-tight truncate drop-shadow-md uppercase tracking-tight">
            {house.title}
          </h2>
          <div className="flex justify-between items-end mt-1">
            <span className="text-xl font-black drop-shadow-md">
              {house.price}<span className="text-[10px] font-light ml-1 text-white/70 tracking-normal">MAD</span>
            </span>
            <p className="text-white/80 text-[10px] font-medium flex items-center gap-1">
              <FiMapPin size={12} style={{ color: primaryRed }} /> {/* UTILISATION ICI */}
              {house.address}
            </p>
          </div>
        </div>

        {/* Caractéristiques */}
        <div className="flex justify-between mb-4 py-3 border-t border-white/20">
          <div className="flex items-center gap-2 text-xs font-bold">
            <FaBed size={14} className="opacity-80" /> <span>{house.rooms}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <FaBath size={14} className="opacity-80" /> <span>{house.bathrooms}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <FiMaximize size={14} className="opacity-80" /> <span>{house.surface} m²</span>
          </div>
        </div>

        {/* Actions & Dates */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Link
              to={`/maisons/${house.id}`}
              className="flex-1 h-11 bg-white text-black rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-300 shadow-xl hover:text-white"
              style={{ '--hover-bg': primaryRed }} /* Utilisation via style pour le hover plus bas ou simple classe */
              onMouseEnter={(e) => e.target.style.backgroundColor = primaryRed}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            >
              DÉTAILS <FiArrowUpRight size={14} />
            </Link>

            {!isAdmin && (
              <button
                onClick={() => toast.success('Ajouté aux favoris')}
                className="w-11 h-11 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl flex items-center justify-center hover:bg-white transition-all shrink-0"
                onMouseEnter={(e) => e.target.style.color = primaryRed}
                onMouseLeave={(e) => e.target.style.color = 'white'}
              >
                <FiHeart size={18} />
              </button>
            )}
          </div>

          <div className="h-4 flex items-center"> 
            {house.status !== 'available' && house.reservedTo && (
              <div className="text-[10px] text-white/90 font-bold italic flex items-center gap-2 animate-pulse">
                <FiCalendar size={12} style={{ color: primaryRed }} /> {/* UTILISATION ICI */}
                <span>Jusqu'au {house.reservedTo}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}