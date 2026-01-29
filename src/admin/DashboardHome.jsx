import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHouses, deleteHouseThunk, updateHouseThunk } from '../store/housesSlice';
import { uploadImageToCloudinary } from '../services/cloudinary';
import HouseCard from '../components/HouseCard';
import toast from 'react-hot-toast';
import { 
  FiSearch, FiFilter, FiX, FiHome, FiMapPin, FiDollarSign, 
  FiMaximize, FiPlus, FiTrash2, FiEdit2, FiLayers, FiChevronDown, FiCalendar 
} from 'react-icons/fi';
import { FaBed, FaBath } from 'react-icons/fa';

export default function DashboardHome() {
  const dispatch = useDispatch();
  const { data: houses, loading, error } = useSelector((state) => state.houses);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const today = new Date().toISOString().split('T')[0];

  // États pour les modales
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [houseToDelete, setHouseToDelete] = useState(null);
  const [houseToEdit, setHouseToEdit] = useState(null);
  
  // États pour l'update
  const [newMainImage, setNewMainImage] = useState(null);
  const [newGalleryFiles, setNewGalleryFiles] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    dispatch(fetchHouses());
  }, [dispatch]);

  // Anti-scroll quand une modale est ouverte
  useEffect(() => {
    document.body.style.overflow = (showEditModal || showDeleteModal) ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showEditModal, showDeleteModal]);

  // Handlers
  const handleEditOpen = (house) => {
    setHouseToEdit({ ...house });
    setNewMainImage(null);
    setNewGalleryFiles([]);
    setShowEditModal(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteHouseThunk(houseToDelete.id)).unwrap();
      toast.success('Maison supprimée');
      setShowDeleteModal(false);
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const toastId = toast.loading("Mise à jour...");

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
          bathrooms: Number(houseToEdit.bathrooms),
          reservedFrom: houseToEdit.status === 'reserved' ? houseToEdit.reservedFrom : null,
          reservedTo: houseToEdit.status === 'reserved' ? houseToEdit.reservedTo : null,
        }
      };

      await dispatch(updateHouseThunk(payload)).unwrap();
      toast.success('Propriété mise à jour !', { id: toastId });
      setShowEditModal(false);
    } catch (error) {
      toast.error('Erreur mise à jour', { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredHouses = houses?.filter((h) => {
    const matchSearch = h.title.toLowerCase().includes(search.toLowerCase()) || 
                       h.address.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' ? true : h.status === statusFilter;
    return matchSearch && matchStatus;
  }) || [];

  if (loading && houses.length === 0) return (
    <div className="flex justify-center items-center py-32">
       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C3091C]"></div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-10">
      
      {/* HEADER DASHBOARD */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col items-center md:items-start">
        <span className="text-[#C3091C] font-serif text-3xl tracking-widest uppercase font-bold">Homy</span>
        <h1 className="text-[10px] text-gray-400 tracking-[0.3em] uppercase mt-1 italic font-bold">
          Gestion du Parc Immobilier
        </h1>
      </div>

      {/* FILTRES STYLE LUXE */}
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-[#C3091C]" />
            <input 
              type="text" 
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
            <FiChevronDown className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* GRILLE DES MAISONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto pb-20">
        {filteredHouses.map((house) => (
          <HouseCard 
            key={house.id} 
            house={house} 
            isAdmin 
            onDelete={(h) => { setHouseToDelete(h); setShowDeleteModal(true); }}
            onEdit={handleEditOpen} 
          />
        ))}
      </div>

      {/* MODALE ÉDITION STYLE LUXE */}
      {showEditModal && houseToEdit && (
        <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-md overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] p-6 md:p-12 w-full max-w-4xl shadow-2xl relative animate-in fade-in zoom-in duration-300">
              
              <button onClick={() => setShowEditModal(false)} className="absolute top-8 right-8 text-gray-400 hover:text-red-600 transition-colors">
                <FiX size={28} />
              </button>

              <div className="mb-10">
                <span className="text-[#C3091C] font-serif text-2xl tracking-widest uppercase font-bold">Homy Edit</span>
                <p className="text-[10px] text-gray-400 uppercase italic font-bold">Mise à jour des informations</p>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                
                {/* Inputs Texte */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Titre</label>
                    <div className="relative">
                      <FiHome className="absolute top-4 left-4 text-[#C3091C]" />
                      <input type="text" className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C]"
                        value={houseToEdit.title} onChange={e => setHouseToEdit({...houseToEdit, title: e.target.value})} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Adresse</label>
                    <div className="relative">
                      <FiMapPin className="absolute top-4 left-4 text-[#C3091C]" />
                      <input type="text" className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C]"
                        value={houseToEdit.address} onChange={e => setHouseToEdit({...houseToEdit, address: e.target.value})} required />
                    </div>
                  </div>
                </div>

                {/* Chiffres */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Prix (MAD)', icon: FiDollarSign, field: 'price' },
                    { label: 'Surface (m²)', icon: FiMaximize, field: 'surface' },
                    { label: 'Lits', icon: FaBed, field: 'rooms' },
                    { label: 'Bains', icon: FaBath, field: 'bathrooms' }
                  ].map((item) => (
                    <div key={item.field} className="space-y-2">
                      <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">{item.label}</label>
                      <div className="relative">
                        <item.icon className="absolute top-4 left-4 text-[#C3091C] text-xs" />
                        <input type="number" min="0" className="w-full p-3.5 pl-10 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C]"
                          value={houseToEdit[item.field]} onChange={e => setHouseToEdit({...houseToEdit, [item.field]: e.target.value})} required />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Type de bien</label>
                    <div className="relative">
                      <FiLayers className="absolute top-4 left-4 text-[#C3091C]" />
                      <select className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none appearance-none border border-transparent focus:border-[#C3091C]"
                        value={houseToEdit.type} onChange={e => setHouseToEdit({...houseToEdit, type: e.target.value})}>
                        <option>Appartement</option><option>Villa</option><option>Maison</option><option>Studio</option>
                      </select>
                      <FiChevronDown className="absolute top-4 right-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Statut</label>
                    <div className="relative">
                      <select className="w-full p-4 bg-gray-50 rounded-2xl text-sm outline-none appearance-none border border-transparent focus:border-[#C3091C]"
                        value={houseToEdit.status} onChange={e => setHouseToEdit({...houseToEdit, status: e.target.value})}>
                        <option value="available">Disponible</option><option value="reserved">Réservé</option>
                      </select>
                      <FiChevronDown className="absolute top-4 right-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Dates si Réservé */}
                {houseToEdit.status === 'reserved' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Début (Aujourd'hui+)</label>
                      <div className="relative">
                        <FiCalendar className="absolute top-4 left-4 text-[#C3091C]" />
                        <input type="date" min={today} className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none"
                          value={houseToEdit.reservedFrom || ''} onChange={e => setHouseToEdit({...houseToEdit, reservedFrom: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Fin</label>
                      <div className="relative">
                        <FiCalendar className="absolute top-4 left-4 text-[#C3091C]" />
                        <input type="date" min={houseToEdit.reservedFrom || today} className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none"
                          value={houseToEdit.reservedTo || ''} onChange={e => setHouseToEdit({...houseToEdit, reservedTo: e.target.value})} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Médias */}
                <div className="space-y-4">
                  <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Visuels de la propriété</label>
                  <div className="relative h-60 rounded-4xl overflow-hidden group border-4 border-gray-50 shadow-inner">
                    <img src={newMainImage ? URL.createObjectURL(newMainImage) : houseToEdit.mainImage} className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <span className="bg-white px-5 py-2 rounded-full font-bold text-[10px]">CHANGER LA COUVERTURE</span>
                      <input type="file" className="hidden" onChange={e => setNewMainImage(e.target.files[0])} />
                    </label>
                  </div>
                  
                  {/* Galerie */}
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    <label className="shrink-0 w-24 h-24 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-red-50 transition-colors">
                      <FiPlus className="text-[#C3091C]" />
                      <input type="file" multiple className="hidden" onChange={e => setNewGalleryFiles([...newGalleryFiles, ...Array.from(e.target.files)])} />
                    </label>
                    {houseToEdit.images.map((img, idx) => (
                      <div key={idx} className="relative shrink-0 w-24 h-24 rounded-2xl overflow-hidden group">
                        <img src={img} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setHouseToEdit({...houseToEdit, images: houseToEdit.images.filter(i => i !== img)})}
                          className="absolute inset-0 bg-red-600/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <FiTrash2 className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={isUpdating} className="w-full py-6 bg-[#C3091C] text-white rounded-3xl font-bold text-[11px] tracking-[0.4em] uppercase shadow-xl hover:bg-black transition-all">
                  {isUpdating ? 'SYNCHRONISATION...' : 'METTRE À JOUR'}
                </button>

              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODALE SUPPRESSION */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiTrash2 className="text-[#C3091C]" size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2 uppercase">Confirmation</h2>
            <p className="text-gray-400 text-xs italic mb-8">Voulez-vous vraiment supprimer cette propriété ?</p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 border border-gray-100 rounded-2xl text-xs font-bold uppercase hover:bg-gray-50 transition-all">Annuler</button>
              <button onClick={confirmDelete} className="flex-1 py-4 bg-[#C3091C] text-white rounded-2xl text-xs font-bold uppercase shadow-lg shadow-red-200">Supprimer</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}