import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHouses, deleteHouseThunk } from '../store/housesSlice';
import HouseCard from '../components/HouseCard';
import toast from 'react-hot-toast';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'; 

export default function DashboardHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const { data: houses, loading, error } = useSelector((state) => state.houses);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [houseToDelete, setHouseToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);


  useEffect(() => {
    dispatch(fetchHouses());
  }, [dispatch]);

  // GESTION SUPPRESSION
  const openDeletePopup = (house) => {
    setHouseToDelete(house);
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    if (!houseToDelete) return;

    try {
      setDeleting(true);
      await dispatch(deleteHouseThunk(houseToDelete.id)).unwrap();
      toast.success('Maison supprimée avec succès');
    } catch (err) {
      toast.error(err?.message || 'Erreur lors de la suppression');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setHouseToDelete(null);
    }
  };



  // GESTION ÉDITION (Optionnel mais recommandé)
  const handleEdit = (house) => {
    // Redirige vers une page d'édition ou ouvre une modale
    navigate(`/admin/editHouse/${house.id}`); 
  };

  const filteredHouses = houses.filter((house) => {
    const matchSearch = house.title.toLowerCase().includes(search.toLowerCase()) || 
                       house.address.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' ? true : house.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) return (
    <div className="flex justify-center items-center py-32">
       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C3091C]"></div>
       <span className="ml-3 text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">Chargement...</span>
    </div>
  );

  if (error) return (
    <div className="text-center mt-20 p-10 bg-red-50 rounded-3xl mx-auto max-w-md">
      <p className="text-red-600 font-bold">Oups ! Une erreur est survenue.</p>
      <p className="text-red-400 text-sm mt-2">{error}</p>
    </div>
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <span className="text-[#C3091C] font-serif text-3xl tracking-[0.2em] uppercase">Homy</span>
        <h1 className="text-[10px] text-gray-400 tracking-[0.3em] uppercase mt-1 italic">Dashboard Propriétés</h1>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-4xl shadow-sm border border-gray-100 p-4 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-[#C3091C]" />
            <input 
              type="text" 
              placeholder="Rechercher par titre ou ville..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C] transition-all" 
            />
          </div>
          <div className="relative">
            <FiFilter className="absolute top-1/2 left-4 -translate-y-1/2 text-[#C3091C]" />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C] appearance-none cursor-pointer"
            >
              <option value="all">Tous les statuts</option>
              <option value="available">Disponible</option>
              <option value="reserved">Réservé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Fixe 3 colonnes carrées */}
      {filteredHouses.length === 0 ? (
        <div className="text-center py-32 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
          <p className="text-gray-400 uppercase text-[10px] tracking-widest font-bold">Aucune propriété trouvée</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
          {filteredHouses.map((house) => (
            <HouseCard 
              key={house.id} 
              house={house} 
              isAdmin 
              onDelete={openDeletePopup}
              onEdit={handleEdit} 
            />
          ))}
        </div>
      )}
      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-fade-in">
            
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Supprimer cette maison ?
            </h2>
            
            <p className="text-gray-500 text-sm mb-6">
              Êtes-vous sûr de vouloir supprimer 
              <span className="font-semibold text-gray-800">
                {" "}{houseToDelete?.title}
              </span> ?  
              Cette action est irréversible.
            </p>

            <div className="flex gap-4 justify-end mt-8">
              {/* Bouton Annuler */}
              <button
                onClick={() => setShowDeleteModal(false)}
                className="
                  px-6 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium
                  cursor-pointer
                  hover:bg-gray-100 hover:text-gray-800
                  transition-all duration-200
                  active:scale-95
                "
              >
                Annuler
              </button>

              {/* Bouton Supprimer */}
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="
                  px-6 py-2 rounded-xl bg-[#C3091C] text-white text-sm font-semibold
                  cursor-pointer
                  hover:bg-[#a10716]
                  hover:shadow-lg
                  transition-all duration-200
                  active:scale-95
                "
              >
                Supprimer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}