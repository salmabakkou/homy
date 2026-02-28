import React from 'react';
import { Link } from 'react-router-dom';
import { FiEdit3, FiTrash2, FiHeart, FiMaximize, FiCalendar, FiMapPin, FiArrowUpRight } from 'react-icons/fi';
import { FaBed, FaBath } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/wishlistSlice';

export default function HouseCard({ house, isAdmin = false, onDelete, onEdit }) {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.wishlist.favorites);
  const reservations = useSelector((state) => state.reservations.data || []);
  const primaryRed = "#C3091C";

  // Vérifie si la maison est déjà en favoris
  const isFavorite = favorites.some(f => f.id === house.id);

  // 1. Récupération de la date locale
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // 2. Extraire UNIQUEMENT les réservations liées à cette maison
  const houseReservations = reservations.filter(res => String(res.houseId) === String(house.id));

  // 3. Chercher si la maison a une réservation "ACTIVE" pour la date d'aujourd'hui
  const activeReservation = houseReservations.find(res => res.from <= today && res.to >= today);

  // 4. Déterminer le statut final strict et la date de libération si occupé
  const currentStatus = activeReservation ? 'reserved' : 'available';
  const displayReservedTo = activeReservation ? activeReservation.to : null;

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(house.id));
      toast.success('Maison retirée des favoris');
    } else {
      dispatch(addFavorite(house));
      toast.success('Maison ajoutée aux favoris');
    }
  };

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
            style={{ color: primaryRed }}
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      )}

      {/* BADGE STATUT */}
      <div className="absolute top-4 left-4 z-20">
        <span
          className="px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] uppercase text-white shadow-lg"
          style={{ backgroundColor: currentStatus === 'available' ? '#10b981' : primaryRed }}
        >
          {currentStatus === 'available' ? 'Libre' : 'Occupé'}
        </span>
      </div>

      {/* CONTENU BAS */}
      <div className="mt-auto p-5 z-10 relative text-white">
        <div className="mb-3">
          <h2 className="text-sm font-bold leading-tight truncate drop-shadow-md uppercase tracking-wider">
            {house.title}
          </h2>
          <div className="flex justify-between items-end mt-1">
            <span className="text-xl font-black drop-shadow-md">
              {house.price}<span className="text-[10px] font-light ml-1 text-white/70 tracking-normal">MAD <span className="text-[8px] opacity-80">/ nuit</span></span>
            </span>
            <p className="text-white/80 text-[10px] font-medium flex items-center gap-1">
              <FiMapPin size={12} style={{ color: primaryRed }} />
              {house.city}
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
        <div className="flex flex-col gap-2 mt-4">
          {!isAdmin && (
            <div className="flex items-center gap-2">
              <Link
                to={`/maisons/${house.id}`}
                className="flex-1 h-11 bg-white text-black rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-300 shadow-xl hover:bg-[#C3091C] hover:text-white"
              >
                DÉTAILS <FiArrowUpRight size={14} />
              </Link>

              <button
                onClick={handleToggleFavorite}
                className={`w-11 h-11 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center transition-all shrink-0 hover:bg-white hover:text-[#C3091C] ${isFavorite ? 'bg-white text-[#C3091C]' : 'bg-white/10 text-white'}`}
              >
                <FiHeart size={18} fill={isFavorite ? "currentColor" : "transparent"} />
              </button>
            </div>
          )}

          <div className="h-4 flex items-center mt-1">
            {currentStatus === 'reserved' && displayReservedTo && (
              <div className="text-[10px] text-white/90 font-bold italic flex items-center gap-2 animate-pulse">
                <FiCalendar size={12} style={{ color: primaryRed }} />
                <span>Jusqu'au {displayReservedTo}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
