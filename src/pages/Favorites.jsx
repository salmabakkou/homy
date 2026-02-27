import React from 'react';
import { useSelector } from 'react-redux';
import { FiMapPin } from 'react-icons/fi';
import HouseCard from '../components/HouseCard';

export default function FavoritesPage() {
  const favorites = useSelector((state) => state.wishlist?.favorites || []);

  if (favorites.length === 0) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#FDFCF9] p-10">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4 uppercase tracking-tight">Pas de favoris pour le moment</h2>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">Ajoutez des maisons à vos favoris pour les retrouver ici.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FDFCF9] p-4 md:p-10">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-serif font-black text-[#C3091C] leading-tight uppercase tracking-tight">
          Collection Privée
        </h1>
        <p className="flex items-center justify-center md:justify-start gap-2 text-gray-400 mt-3 font-bold uppercase tracking-[0.4em] text-[10px]">
          <FiMapPin className="text-[#C3091C]" /> Vos propriétés d'exception
        </p>
      </div>

      {/* GRILLE MAISONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto pb-20">
        {favorites.map((house) => (
          <HouseCard key={house.id} house={house} />
        ))}
      </div>
    </div>
  );
}
