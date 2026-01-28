import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHouses } from '../store/housesSlice';
import HouseCard from '../components/HouseCard';
import { FiSearch, FiMapPin } from 'react-icons/fi';

export default function Houses() {
  const dispatch = useDispatch();
  const { data: houses, loading, error } = useSelector(
    (state) => state.houses
  );

  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchHouses());
  }, [dispatch]);

  // --- FILTRAGE SIMPLE ---
  const filteredHouses = houses.filter((house) => {
    const matchSearch =
      house.title.toLowerCase().includes(search.toLowerCase()) ||
      house.address.toLowerCase().includes(search.toLowerCase());

    const matchCity =
      cityFilter === 'all'
        ? true
        : house.address.toLowerCase().includes(cityFilter.toLowerCase());

    return matchSearch && matchCity;
  });

  return (
    <div className="bg-[#F6F3EE] min-h-screen">
      
      {/* HERO SECTION LUXE */}
      <section className="relative h-[45vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
          alt="Luxury Morocco"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-serif text-white tracking-widest">
            Maisons & Riads d’Exception
          </h1>
          <p className="mt-4 text-white/80 tracking-widest text-xs uppercase">
            Trouvez votre prochaine destination de rêve au Maroc
          </p>
        </div>
      </section>

      {/* FILTRES LUXE SIMPLES */}
      <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Recherche */}
          <div className="relative md:col-span-2">
            <FiSearch className="absolute top-1/2 left-5 -translate-y-1/2 text-[#C3091C]" />
            <input
              type="text"
              placeholder="Rechercher par nom ou localisation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#C3091C]/30"
            />
          </div>

          {/* Ville simple */}
          <div className="relative">
            <FiMapPin className="absolute top-1/2 left-5 -translate-y-1/2 text-[#C3091C]" />
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full pl-14 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#C3091C]/30 cursor-pointer"
            >
              <option value="all">Toutes les villes</option>
              <option value="marrakech">Marrakech</option>
              <option value="casablanca">Casablanca</option>
              <option value="rabat">Rabat</option>
              <option value="fes">Fès</option>
              <option value="tanger">Tanger</option>
              <option value="agadir">Agadir</option>
            </select>
          </div>
        </div>
      </section>

      {/* GRID MAISONS */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        
        {loading && (
          <div className="text-center py-32 text-gray-400 tracking-widest text-xs uppercase">
            Chargement des propriétés...
          </div>
        )}

        {error && (
          <div className="text-center py-32 text-red-500">
            Erreur lors du chargement des données.
          </div>
        )}

        {!loading && filteredHouses.length === 0 && (
          <div className="text-center py-32 text-gray-400 tracking-widest text-xs uppercase">
            Aucune propriété trouvée
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredHouses.map((house) => (
            <HouseCard
              key={house.id}
              house={house}
              isAdmin={false}  
            />
          ))}
        </div>
      </section>
    </div>
  );
}
