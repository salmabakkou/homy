import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHouses, deleteHouseThunk, updateHouseThunk } from '../store/housesSlice';
import { uploadImageToCloudinary } from '../services/cloudinary';
import HouseCard from '../components/HouseCard';
import toast from 'react-hot-toast';
import { 
  FiSearch, FiX, FiHome, FiMapPin, FiDollarSign, 
  FiMaximize, FiPlus, FiTrash2, FiEdit2 
} from 'react-icons/fi'; 
import { FaBed, FaBath } from 'react-icons/fa';

export default function DashboardHome() {
  const dispatch = useDispatch();
  
  // On ne récupère que ce qu'on utilise pour éviter les erreurs ESLint (variables inutilisées)
  const { data: houses, loading } = useSelector((state) => state.houses);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [houseToDelete, setHouseToDelete] = useState(null);
  const [houseToEdit, setHouseToEdit] = useState(null);
  
  const [newMainImage, setNewMainImage] = useState(null);
  const [newGalleryFiles, setNewGalleryFiles] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    dispatch(fetchHouses());
  }, [dispatch]);

  // --- LOGIQUE ANTI-SCROLL ARRIÈRE-PLAN ---
  useEffect(() => {
    if (showEditModal || showDeleteModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showEditModal, showDeleteModal]);

  const handleEditOpen = (house) => {
    setHouseToEdit({ ...house });
    setNewMainImage(null);
    setNewGalleryFiles([]);
    setShowEditModal(true);
  };

  const confirmDelete = async () => {
    if (!houseToDelete) return;
    try {
      await dispatch(deleteHouseThunk(houseToDelete.id)).unwrap();
      toast.success('Maison supprimée');
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Erreur suppression:", error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const toastId = toast.loading("Mise à jour en cours...");

    try {
      let finalMainImage = houseToEdit.mainImage;
      let finalGallery = [...houseToEdit.images];

      if (newMainImage) {
        finalMainImage = await uploadImageToCloudinary(newMainImage);
      }

      if (newGalleryFiles.length > 0) {
        for (const file of newGalleryFiles) {
          const url = await uploadImageToCloudinary(file);
          finalGallery.push(url);
        }
      }

      const payload = {
        id: houseToEdit.id,
        houseData: {
          ...houseToEdit,
          mainImage: finalMainImage,
          images: finalGallery,
          price: Number(houseToEdit.price),
          surface: Number(houseToEdit.surface),
          rooms: Number(houseToEdit.rooms),
          bathrooms: Number(houseToEdit.bathrooms)
        }
      };

      await dispatch(updateHouseThunk(payload)).unwrap();
      toast.success('Propriété mise à jour !', { id: toastId });
      setShowEditModal(false);
    } catch (error) {
      console.error("Erreur mise à jour:", error);
      toast.error('Erreur lors de la mise à jour', { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredHouses = houses.filter((h) => {
    const matchSearch = h.title.toLowerCase().includes(search.toLowerCase()) || 
                       h.address.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' ? true : h.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      {/* HEADER */}
      <div className="mb-10 flex flex-col items-center md:items-start">
        <span className="text-[#C3091C] font-serif text-3xl tracking-widest uppercase font-bold">Homy</span>
        <h1 className="text-[10px] text-gray-400 tracking-[0.3em] uppercase mt-1 italic font-bold text-center md:text-left">
          Tableau de bord / Gestion des propriétés
        </h1>
      </div>

      {/* FILTRES */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 mb-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-[#C3091C]" />
            <input 
              type="text" 
              placeholder="Rechercher une propriété..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C] transition-all" 
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-4 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C] cursor-pointer appearance-none"
          >
            <option value="all">Tous les statuts</option>
            <option value="available">Disponible</option>
            <option value="reserved">Réservé</option>
          </select>
        </div>
      </div>

      {/* LISTE DES CARTES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto pb-20">
        {loading && houses.length === 0 ? (
           <div className="col-span-full flex flex-col items-center py-20 gap-4">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C3091C]"></div>
             <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">Chargement des données...</p>
           </div>
        ) : (
          filteredHouses.map((house) => (
            <HouseCard 
              key={house.id} 
              house={house} 
              isAdmin 
              onDelete={(h) => { setHouseToDelete(h); setShowDeleteModal(true); }}
              onEdit={handleEditOpen} 
            />
          ))
        )}
      </div>

      {/* --- MODALE ÉDITION  */}
      {showEditModal && houseToEdit && (
        <div className="fixed inset-0 z-100 bg-black/70 backdrop-blur-md overflow-y-auto overflow-x-hidden">
          {/* Ce conteneur permet le scroll unique sur le côté droit de l'écran */}
          <div className="min-h-screen flex items-center justify-center p-4 md:p-10">
            <div className="bg-white rounded-[2.5rem] p-6 md:p-10 w-full max-w-4xl shadow-2xl relative animate-in fade-in zoom-in duration-300">
              
              {/* HEADER DE LA MODALE */}
              <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                <div>
                  <span className="text-[#C3091C] font-serif text-2xl tracking-tighter uppercase font-bold">Homy</span>
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black italic">Dashboard / Modification de propriété</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowEditModal(false)} 
                  className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-full hover:bg-red-50 hover:text-[#C3091C] transition-all cursor-pointer group"
                >
                  <FiX size={24} className="group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-8">
                
                {/* SECTION 1 : INFORMATIONS GÉNÉRALES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Titre de l'annonce</label>
                    <div className="relative">
                      <FiHome className="absolute top-4 left-4 text-[#C3091C]" />
                      <input 
                        type="text" 
                        className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C] focus:bg-white transition-all shadow-sm"
                        value={houseToEdit.title} 
                        onChange={e => setHouseToEdit({...houseToEdit, title: e.target.value})} 
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Localisation / Adresse</label>
                    <div className="relative">
                      <FiMapPin className="absolute top-4 left-4 text-[#C3091C]" />
                      <input 
                        type="text" 
                        className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C] focus:bg-white transition-all shadow-sm"
                        value={houseToEdit.address} 
                        onChange={e => setHouseToEdit({...houseToEdit, address: e.target.value})} 
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2 : CARACTÉRISTIQUES CHIFFRÉES */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Prix (MAD)</label>
                    <div className="relative">
                      <FiDollarSign className="absolute top-4 left-4 text-[#C3091C] text-xs" />
                      <input 
                        type="number" 
                        className="w-full p-3.5 pl-10 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C] focus:bg-white shadow-sm"
                        value={houseToEdit.price} 
                        onChange={e => setHouseToEdit({...houseToEdit, price: e.target.value})} 
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Surface (m²)</label>
                    <div className="relative">
                      <FiMaximize className="absolute top-4 left-4 text-[#C3091C] text-xs" />
                      <input 
                        type="number" 
                        className="w-full p-3.5 pl-10 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C] focus:bg-white shadow-sm"
                        value={houseToEdit.surface} 
                        onChange={e => setHouseToEdit({...houseToEdit, surface: e.target.value})} 
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Chambres</label>
                    <div className="relative">
                      <FaBed className="absolute top-4 left-4 text-[#C3091C] text-xs" />
                      <input 
                        type="number" 
                        className="w-full p-3.5 pl-10 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C] focus:bg-white shadow-sm"
                        value={houseToEdit.rooms} 
                        onChange={e => setHouseToEdit({...houseToEdit, rooms: e.target.value})} 
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Salles de bain</label>
                    <div className="relative">
                      <FaBath className="absolute top-4 left-4 text-[#C3091C] text-xs" />
                      <input 
                        type="number" 
                        className="w-full p-3.5 pl-10 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C] focus:bg-white shadow-sm"
                        value={houseToEdit.bathrooms} 
                        onChange={e => setHouseToEdit({...houseToEdit, bathrooms: e.target.value})} 
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 3 : MÉDIAS (IMAGE DE COUVERTURE) */}
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Image de couverture principale</label>
                  <div className="relative h-72 w-full rounded-[2.5rem] overflow-hidden group border-4 border-white shadow-lg">
                    <img 
                      src={newMainImage ? URL.createObjectURL(newMainImage) : houseToEdit.mainImage} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      alt="Main Preview" 
                    />
                    <label className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                      <div className="bg-white text-black px-8 py-3 rounded-full font-bold text-[10px] tracking-widest flex items-center gap-3 shadow-2xl hover:scale-105 transition-transform">
                        <FiEdit2 size={16} /> REMPLACER LA PHOTO
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={e => setNewMainImage(e.target.files[0])} />
                    </label>
                  </div>
                </div>

                {/* SECTION 4 : GALERIE D'IMAGES */}
                <div className="space-y-3">
                  <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Galerie photos supplémentaires</label>
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[#C3091C] scrollbar-track-gray-100">
                    {/* Bouton Ajouter */}
                    <label className="shrink-0 w-32 h-32 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-[#C3091C] hover:bg-red-50 transition-all group">
                      <FiPlus className="text-[#C3091C] text-2xl group-hover:scale-125 transition-transform" />
                      <span className="text-[8px] font-black uppercase text-gray-400 mt-2 tracking-tighter">Ajouter</span>
                      <input type="file" multiple className="hidden" accept="image/*" onChange={e => setNewGalleryFiles([...newGalleryFiles, ...Array.from(e.target.files)])} />
                    </label>

                    {/* Photos existantes dans le store */}
                    {houseToEdit.images.map((img, idx) => (
                      <div key={`old-${idx}`} className="relative shrink-0 w-32 h-32 rounded-3xl overflow-hidden shadow-md group">
                        <img src={img} className="w-full h-full object-cover" alt="Gallery" />
                        <button 
                          type="button" 
                          onClick={() => setHouseToEdit({...houseToEdit, images: houseToEdit.images.filter(i => i !== img)})} 
                          className="absolute inset-0 bg-red-600/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <FiTrash2 className="text-white" size={24} />
                        </button>
                      </div>
                    ))}

                    {/* Prévisualisation des nouvelles photos sélectionnées */}
                    {newGalleryFiles.map((file, idx) => (
                      <div key={`new-${idx}`} className="relative shrink-0 w-32 h-32 rounded-3xl overflow-hidden border-4 border-[#C3091C]/20 shadow-md group">
                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover opacity-70" alt="New Preview" />
                        <button 
                          type="button" 
                          onClick={() => setNewGalleryFiles(newGalleryFiles.filter((_, i) => i !== idx))} 
                          className="absolute top-2 right-2 bg-white rounded-full p-1.5 cursor-pointer shadow-lg hover:bg-red-50"
                        >
                          <FiX size={12} className="text-red-600" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-[#C3091C] text-white text-[7px] px-2 py-0.5 rounded-full font-bold uppercase">Nouveau</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECTION 5 : DESCRIPTION */}
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Description de la propriété</label>
                  <textarea 
                    className="w-full p-6 bg-gray-50 rounded-4xl text-sm outline-none border border-transparent focus:border-[#C3091C] focus:bg-white h-40 resize-none shadow-inner transition-all"
                    placeholder="Détaillez les points forts de la maison..."
                    value={houseToEdit.description || ''} 
                    onChange={e => setHouseToEdit({...houseToEdit, description: e.target.value})} 
                  />
                </div>

                {/* SECTION 6 : ACTION FINALE */}
                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isUpdating} 
                    className="w-full py-6 bg-[#C3091C] text-white rounded-4xl font-bold text-[12px] tracking-[0.4em] uppercase shadow-2xl hover:bg-black active:scale-[0.97] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isUpdating ? (
                      <span className="flex items-center justify-center gap-3">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        SYNCHRONISATION...
                      </span>
                    ) : (
                      'ENREGISTRER LES MODIFICATIONS'
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODALE SUPPRESSION */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-6 uppercase tracking-tight">Supprimer l'annonce ?</h2>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className="flex-1 py-4 border border-gray-100 rounded-2xl text-xs font-bold uppercase cursor-pointer hover:bg-gray-50 transition-all"
              >
                Annuler
              </button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 py-4 bg-[#C3091C] text-white rounded-2xl text-xs font-bold uppercase cursor-pointer shadow-lg hover:shadow-[#C3091C]/30 transition-all"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}