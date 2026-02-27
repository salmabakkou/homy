import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHouses } from '../store/housesSlice';
import HouseCard from '../components/HouseCard';
import { FiSearch, FiMapPin } from 'react-icons/fi';
import heroImg from '../assets/homy1.jpg';

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
    const houseCity = house.city ? house.city.toLowerCase() : "";
    const houseAddress = house.address ? house.address.toLowerCase() : "";
    const houseTitle = house.title ? house.title.toLowerCase() : "";
    const searchVal = search.toLowerCase();

    const matchSearch =
      houseTitle.includes(searchVal) ||
      houseCity.includes(searchVal) ||
      houseAddress.includes(searchVal);

    const matchCity =
      cityFilter === 'all'
        ? true
        : houseCity.includes(cityFilter.toLowerCase()) || houseAddress.includes(cityFilter.toLowerCase());

    return matchSearch && matchCity;
  });

  return (
    <div className="bg-[#FDFCF9] min-h-screen">

      {/* HERO SECTION SIMPLE */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        {/* Image de fond simple */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="Maisons"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Contenu textuel simple */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-2xl md:text-3xl font-serif font-black text-white uppercase tracking-wider shadow-sm">
            Toutes Nos Maisons
          </h1>
          <p className="text-white/80 mt-4 text-sm font-medium uppercase tracking-[0.2em]">
            Trouvez la propriété qui vous correspond
          </p>
        </div>
      </section>

      {/* FILTRES LUXE SIMPLES */}
      <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-4">

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
      <section className="max-w-7xl mx-auto px-8 pb-32 pt-16">

        {error && (
          <div className="text-center py-32 text-[#C3091C] font-bold uppercase tracking-[0.4em] text-[10px]">
            Erreur lors du chargement des données.
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C3091C] mb-4"></div>
            <div className="text-gray-400 font-bold uppercase tracking-[0.4em] text-[10px]">
              Chargement en cours...
            </div>
          </div>
        ) : !loading && filteredHouses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="text-gray-400 font-bold uppercase tracking-[0.4em] text-[10px]">
              Aucune propriété trouvée
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredHouses.map((house) => (
              <HouseCard
                key={house.id}
                house={house}
                isAdmin={false}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
