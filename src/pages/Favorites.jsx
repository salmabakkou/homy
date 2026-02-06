import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFavorite } from '../store/wishlistSlice';
import { Link } from 'react-router-dom';
import { FiHeart, FiMapPin, FiArrowUpRight, FiCalendar } from 'react-icons/fi';
import { FaBed, FaBath } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function FavoritesPage() {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.wishlist?.favorites || []);
  const primaryRed = "#C3091C";

  const handleRemoveFavorite = (id) => {
    dispatch(removeFavorite(id));
    toast.success('Maison retirée des favoris');
  };

  if (favorites.length === 0) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50 p-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pas de favoris pour le moment</h2>
        <p className="text-gray-400 text-sm">Ajoutez des maisons à vos favoris pour les retrouver ici.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-10">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col items-center md:items-start">
        <span className="text-[#C3091C] font-serif text-3xl tracking-widest uppercase font-bold">Homy</span>
        <h1 className="text-[10px] text-gray-400 tracking-[0.3em] uppercase mt-1 italic font-bold">
          Vos Favoris
        </h1>
      </div>

      {/* GRILLE MAISONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto pb-20">
        {favorites.map((house) => (
          <div key={house.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col relative w-full aspect-square">
            
            {/* Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={house.mainImage}
                alt={house.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/20 to-transparent" />
            </div>

            {/* Badge statut */}
            <div className="absolute top-4 left-4 z-20">
              <span 
                className="px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] uppercase text-white shadow-lg"
                style={{ backgroundColor: house.status === 'available' ? '#10b981' : primaryRed }}
              >
                {house.status === 'available' ? 'Libre' : 'Occupé'}
              </span>
            </div>

            {/* Contenu bas */}
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
                    <FiMapPin size={12} style={{ color: primaryRed }} />
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
                  <span>{house.surface} m²</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/maisons/${house.id}`}
                    className="flex-1 h-11 bg-white text-black rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-300 shadow-xl hover:text-white"
                    style={{ '--hover-bg': primaryRed }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = primaryRed}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  >
                    DÉTAILS <FiArrowUpRight size={14} />
                  </Link>

                  <button
                    onClick={() => handleRemoveFavorite(house.id)}
                    className="w-11 h-11 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl flex items-center justify-center hover:bg-white transition-all shrink-0"
                    onMouseEnter={(e) => e.target.style.color = primaryRed}
                    onMouseLeave={(e) => e.target.style.color = 'white'}
                  >
                    <FiHeart size={18} style={{ color: primaryRed }} />
                  </button>
                </div>

                {/* Date réservation si occupé */}
                {house.status !== 'available' && house.reservedTo && (
                  <div className="text-[10px] text-white/90 font-bold italic flex items-center gap-2 animate-pulse mt-1">
                    <FiCalendar size={12} style={{ color: primaryRed }} />
                    <span>Jusqu'au {house.reservedTo}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
