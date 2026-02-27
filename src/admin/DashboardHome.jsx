import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHouses, deleteHouseThunk, updateHouseThunk } from '../store/housesSlice';
import { uploadImageToCloudinary } from '../services/cloudinary';
import HouseCard from '../components/HouseCard';
import toast from 'react-hot-toast';

import {
  FiSearch, FiFilter, FiX, FiHome, FiMapPin, FiDollarSign,
  FiMaximize, FiPlus, FiTrash2, FiLayers, FiChevronDown, FiCalendar, FiLoader
} from 'react-icons/fi';
import { FaBed, FaBath, FaCity } from 'react-icons/fa';


export default function DashboardHome() {
  const dispatch = useDispatch();
  const { data: houses, loading, error } = useSelector((state) => state.houses);
  const reservations = useSelector((state) => state.reservations.data || []);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // États pour les modales
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [houseToDelete, setHouseToDelete] = useState(null);
  const [houseToEdit, setHouseToEdit] = useState(null);

  // États pour l'updat
  const [newMainImage, setNewMainImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newGalleryFiles, setNewGalleryFiles] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchHouses());
  }, [dispatch]);

  // Anti-scroll quand une modale est ouverte
  useEffect(() => {
    document.body.style.overflow = (showEditModal || showDeleteModal) ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showEditModal, showDeleteModal]);

  //pour éviter les memory leaks avec les previews d'images
  useEffect(() => {
    return () => {
      newGalleryFiles.forEach(file => {
        URL.revokeObjectURL(file);
      });
    };
  }, [newGalleryFiles]);


  // Handlers
  const handleEditOpen = (house) => {
    setHouseToEdit({ ...house });
    setNewMainImage(null);
    setImagePreview(null);
    setNewGalleryFiles([]);
    setShowEditModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteHouseThunk(houseToDelete.id)).unwrap();
      toast.success('Maison supprimée');
      setShowDeleteModal(false);
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    } finally {
      setIsDeleting(false);
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
      setImagePreview(null);
      setNewMainImage(null);
      setNewGalleryFiles([]);
    } catch (error) {
      toast.error('Erreur mise à jour', { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredHouses = houses?.filter((h) => {
    // 1. Filtrage par texte (Recherche sécurisée comme dans Houses.jsx)
    const houseCity = h.city ? h.city.toLowerCase() : "";
    const houseAddress = h.address ? h.address.toLowerCase() : "";
    const houseTitle = h.title ? h.title.toLowerCase() : "";
    const searchVal = search.toLowerCase();

    const matchSearch =
      houseTitle.includes(searchVal) ||
      houseCity.includes(searchVal) ||
      houseAddress.includes(searchVal);

    // 2. Filtrage par Statut strict basé sur les réservations
    const houseReservations = reservations.filter(res => String(res.houseId) === String(h.id));

    // Obtenir la date exacte d'aujourd'hui (fuseau horaire de l'utilisateur)
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // Si la maison a une réservation "ACTIVE" pour la date d'aujourd'hui
    const activeReservation = houseReservations.find(res => res.from <= today && res.to >= today);

    const currentStatus = activeReservation ? 'reserved' : 'available';

    const matchStatus = statusFilter === 'all' ? true : currentStatus === statusFilter;

    return matchSearch && matchStatus;
  }) || [];



  return (
    <div className="w-full min-h-screen bg-[#FDFCF9] p-4 md:p-10">

      {/* HEADER DASHBOARD */}
      <div className="max-w-7xl mx-auto mb-10 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-serif font-black text-[#C3091C] leading-tight uppercase tracking-tight">
          Espace Administration
        </h1>
        <p className="flex items-center justify-center md:justify-start gap-2 text-gray-400 mt-3 font-bold uppercase tracking-[0.4em] text-[10px]">
          Supervision du portefeuille immobilier
        </p>
      </div>

      {/* FILTRES STYLE LUXE */}
      <div className="max-w-7xl mx-auto bg-white rounded-[2rem] shadow-xl border border-gray-100 p-6 md:p-8 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <FiSearch className="absolute top-1/2 left-5 -translate-y-1/2 text-[#C3091C]" />
            <input
              type="text"
              placeholder="Rechercher par nom ou localisation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#C3091C]/30 transition-all"
            />
          </div>
          <div className="relative">
            <FiFilter className="absolute top-1/2 left-5 -translate-y-1/2 text-[#C3091C]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-14 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#C3091C]/30 appearance-none cursor-pointer"
            >
              <option value="all">Tous les statuts</option>
              <option value="available">Libre</option>
              <option value="reserved">Occupé</option>
            </select>
            <FiChevronDown className="absolute top-1/2 right-4 -translate-y-1/2 text-[#C3091C] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* GRILLE DES MAISONS */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C3091C] mb-4"></div>
          <div className="text-gray-400 font-bold uppercase tracking-[0.4em] text-[10px]">
            Chargement en cours...
          </div>
        </div>
      ) : filteredHouses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="text-gray-400 font-bold uppercase tracking-[0.4em] text-[10px]">
            Aucune propriété trouvée
          </div>
        </div>
      ) : (
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
      )}

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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Titre</label>
                    <div className="relative">
                      <FiHome className="absolute top-4 left-4 text-[#C3091C]" />
                      <input type="text" className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C]"
                        value={houseToEdit.title} onChange={e => setHouseToEdit({ ...houseToEdit, title: e.target.value })} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Ville</label>
                    <div className="relative">
                      <FaCity className="absolute top-4 left-4 text-[#C3091C]" />
                      <input type="text" className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C]"
                        value={houseToEdit.city || ''} onChange={e => setHouseToEdit({ ...houseToEdit, city: e.target.value })} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Adresse</label>
                    <div className="relative">
                      <FiMapPin className="absolute top-4 left-4 text-[#C3091C]" />
                      <input type="text" className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C]"
                        value={houseToEdit.address} onChange={e => setHouseToEdit({ ...houseToEdit, address: e.target.value })} required />
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
                          value={houseToEdit[item.field]} onChange={e => setHouseToEdit({ ...houseToEdit, [item.field]: e.target.value })} required />
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
                        value={houseToEdit.type} onChange={e => setHouseToEdit({ ...houseToEdit, type: e.target.value })}>
                        <option>Appartement</option><option>Villa</option><option>Maison</option><option>Studio</option>
                      </select>
                      <FiChevronDown className="absolute top-4 right-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Statut</label>
                    <div className="relative">
                      <select className="w-full p-4 bg-gray-50 rounded-2xl text-sm outline-none appearance-none border border-transparent focus:border-[#C3091C]"
                        value={houseToEdit.status} onChange={e => setHouseToEdit({ ...houseToEdit, status: e.target.value })}>
                        <option value="available">Libre</option><option value="reserved">Occupé</option>
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
                          value={houseToEdit.reservedFrom || ''} onChange={e => setHouseToEdit({ ...houseToEdit, reservedFrom: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Fin</label>
                      <div className="relative">
                        <FiCalendar className="absolute top-4 left-4 text-[#C3091C]" />
                        <input type="date" min={houseToEdit.reservedFrom || today} className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none"
                          value={houseToEdit.reservedTo || ''} onChange={e => setHouseToEdit({ ...houseToEdit, reservedTo: e.target.value })} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Médias */}
                <div className="space-y-4">
                  <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Visuels de la propriété</label>
                  <div className="relative h-60 rounded-4xl overflow-hidden group border-4 border-gray-50 shadow-inner">
                    <img
                      src={imagePreview || houseToEdit.mainImage}
                      className="w-full h-full object-cover"
                    />
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <span className="bg-white px-5 py-2 rounded-full font-bold text-[10px]">CHANGER LA COUVERTURE</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setNewMainImage(file);
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Galerie */}
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">

                    {/* Bouton ajout */}
                    <label className="shrink-0 w-24 h-24 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-red-50 transition-colors">
                      <FiPlus className="text-[#C3091C]" />
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          setNewGalleryFiles(prev => [...prev, ...files]);
                        }}
                      />
                    </label>

                    {/* Images existantes */}
                    {houseToEdit.images?.map((img, idx) => (
                      <div key={`old-${idx}`} className="relative shrink-0 w-24 h-24 rounded-2xl overflow-hidden group">
                        <img src={img} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() =>
                            setHouseToEdit({
                              ...houseToEdit,
                              images: houseToEdit.images.filter((_, i) => i !== idx),
                            })
                          }
                          className="absolute inset-0 bg-red-600/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          <FiTrash2 className="text-white" />
                        </button>
                      </div>
                    ))}

                    {/* Nouvelles images (preview immédiat) */}
                    {newGalleryFiles.map((file, idx) => (
                      <div key={`new-${idx}`} className="relative shrink-0 w-24 h-24 rounded-2xl overflow-hidden group">
                        <img
                          src={URL.createObjectURL(file)}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setNewGalleryFiles(newGalleryFiles.filter((_, i) => i !== idx))
                          }
                          className="absolute inset-0 bg-red-600/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          <FiTrash2 className="text-white" />
                        </button>
                      </div>
                    ))}

                  </div>

                </div>

                <button type="submit" disabled={isUpdating} className="w-full py-6 bg-[#C3091C] text-white rounded-3xl font-bold text-[11px] tracking-[0.4em] uppercase shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3">
                  {isUpdating ? (
                    <>
                      <FiLoader className="animate-spin text-lg" />
                      SYNCHRONISATION...
                    </>
                  ) : (
                    'METTRE À JOUR'
                  )}
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
              <button disabled={isDeleting} onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 border border-gray-100 rounded-2xl text-xs font-bold uppercase hover:bg-gray-50 transition-all disabled:opacity-50">Annuler</button>
              <button disabled={isDeleting} onClick={confirmDelete} className="flex-1 py-4 bg-[#C3091C] text-white rounded-2xl text-xs font-bold uppercase shadow-lg shadow-red-200 flex items-center justify-center gap-2 disabled:opacity-50">
                {isDeleting ? <FiLoader className="animate-spin" /> : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}