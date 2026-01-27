import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addHouseThunk } from '../store/housesSlice';
import { uploadImageToCloudinary } from '../services/cloudinary';
import toast from 'react-hot-toast';
import { FiUpload, FiHome, FiMapPin, FiDollarSign, FiMaximize, FiX, FiCalendar, FiPlus, FiEdit2 } from 'react-icons/fi';
import { FaBed, FaBath } from 'react-icons/fa';

export default function AddHouse() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.houses);

  const [formData, setFormData] = useState({
    title: '', address: '', price: '', description: '',
    rooms: '', bathrooms: '', surface: '',
    type: 'Appartement', status: 'available',
    reservedFrom: '', reservedTo: '',
  });

  const [errors, setErrors] = useState({});
  const [mainImage, setMainImage] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleMainImageChange = (e) => {
    if (e.target.files[0]) {
      setMainImage(e.target.files[0]);
      setErrors({ ...errors, mainImage: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Titre requis";
    if (!formData.address) newErrors.address = "Adresse requise";
    if (!formData.price) newErrors.price = "Prix requis";
    if (!formData.surface) newErrors.surface = "Surface requise";
    if (!formData.rooms) newErrors.rooms = "Lits requis";
    if (!formData.bathrooms) newErrors.bathrooms = "Bains requis";
    if (!formData.description) newErrors.description = "Description requise";
    if (!mainImage) newErrors.mainImage = "Photo principale requise";
    
    if (formData.status === 'reserved') {
      if (!formData.reservedFrom) newErrors.reservedFrom = "Début requis";
      if (!formData.reservedTo) newErrors.reservedTo = "Fin requise";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const uploadedImages = [];
      const mainImageUrl = await uploadImageToCloudinary(mainImage);
      for (const file of imageFiles) {
        const url = await uploadImageToCloudinary(file);
        uploadedImages.push(url);
      }
      const houseData = {
        ...formData,
        price: Number(formData.price), rooms: Number(formData.rooms),
        bathrooms: Number(formData.bathrooms), surface: Number(formData.surface),
        mainImage: mainImageUrl, images: uploadedImages,
        reservedFrom: formData.status === 'reserved' ? formData.reservedFrom : null,
        reservedTo: formData.status === 'reserved' ? formData.reservedTo : null,
      };
      await dispatch(addHouseThunk(houseData)).unwrap();
      toast.success('Propriété publiée');
      setFormData({ title: '', address: '', price: '', description: '', rooms: '', bathrooms: '', surface: '', type: 'Appartement', status: 'available', reservedFrom: '', reservedTo: '' });
      setMainImage(null); setImageFiles([]);
    } catch (error) {
      console.error(error);
      toast.error("Erreur de publication");
    }
  };

  return (
    /* STRUCTURE HARMONISÉE AVEC DASHBOARD */
    <div className="w-full">
      
      {/* Header (Identique au Dashboard) */}
      <div className="mb-10 text-center md:text-left">
        <span className="text-[#C3091C] font-serif text-3xl tracking-[0.2em] uppercase">Homy</span>
        <h1 className="text-[10px] text-gray-400 tracking-[0.3em] uppercase mt-1 italic">Nouvelle Propriété</h1>
      </div>

      {/* Formulaire dans une carte stylisée */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-6 md:p-10 mb-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Ligne 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <FiHome className="absolute top-4 left-4 text-[#C3091C]" />
              <input type="text" name="title" placeholder="Titre de la propriété" value={formData.title} onChange={handleChange}
                className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C]" />
              {errors.title && <p className="text-red-500 text-[11px] mt-1 ml-2">{errors.title}</p>}
            </div>
            <div className="relative">
              <FiMapPin className="absolute top-4 left-4 text-[#C3091C]" />
              <input type="text" name="address" placeholder="Ville ou Adresse" value={formData.address} onChange={handleChange}
                className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C]" />
              {errors.address && <p className="text-red-500 text-[11px] mt-1 ml-2">{errors.address}</p>}
            </div>
          </div>

          {/* Chiffres */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <FiDollarSign className="absolute top-4 left-4 text-[#C3091C] text-xs" />
              <input type="number" name="price" placeholder="Prix (MAD)" value={formData.price} onChange={handleChange}
                className="w-full p-3.5 pl-10 bg-gray-50 rounded-2xl text-sm outline-none focus:border-[#C3091C] border border-transparent" />
              {errors.price && <p className="text-red-500 text-[10px] mt-1">{errors.price}</p>}
            </div>
            <div className="relative">
              <FiMaximize className="absolute top-4 left-4 text-[#C3091C] text-xs" />
              <input type="number" name="surface" placeholder="m²" value={formData.surface} onChange={handleChange}
                className="w-full p-3.5 pl-10 bg-gray-50 rounded-2xl text-sm outline-none focus:border-[#C3091C] border border-transparent" />
              {errors.surface && <p className="text-red-500 text-[10px] mt-1">{errors.surface}</p>}
            </div>
            <div className="relative">
              <FaBed className="absolute top-4 left-4 text-[#C3091C] text-xs" />
              <input type="number" name="rooms" placeholder="Chambres" value={formData.rooms} onChange={handleChange}
                className="w-full p-3.5 pl-10 bg-gray-50 rounded-2xl text-sm outline-none focus:border-[#C3091C] border border-transparent" />
              {errors.rooms && <p className="text-red-500 text-[10px] mt-1">{errors.rooms}</p>}
            </div>
            <div className="relative">
              <FaBath className="absolute top-4 left-4 text-[#C3091C] text-xs" />
              <input type="number" name="bathrooms" placeholder="Salles de bain" value={formData.bathrooms} onChange={handleChange}
                className="w-full p-3.5 pl-10 bg-gray-50 rounded-2xl text-sm outline-none focus:border-[#C3091C] border border-transparent" />
              {errors.bathrooms && <p className="text-red-500 text-[10px] mt-1">{errors.bathrooms}</p>}
            </div>
          </div>

          {/* Type & Statut */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select name="type" value={formData.type} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C]">
              <option>Appartement</option><option>Villa</option><option>Maison</option><option>Studio</option>
            </select>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C]">
              <option value="available">Disponible</option><option value="reserved">Réservé</option>
            </select>
          </div>

          {/* Dates si Réservé */}
          {formData.status === 'reserved' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
              <div className="relative">
                <FiCalendar className="absolute top-4 left-4 text-[#C3091C] z-10" />
                <input type="date" name="reservedFrom" value={formData.reservedFrom} onChange={handleChange}
                  className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C]" />
                {errors.reservedFrom && <p className="text-red-500 text-[10px] mt-1 ml-2">{errors.reservedFrom}</p>}
              </div>
              <div className="relative">
                <FiCalendar className="absolute top-4 left-4 text-[#C3091C] z-10" />
                <input type="date" name="reservedTo" value={formData.reservedTo} onChange={handleChange}
                  className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C]" />
                {errors.reservedTo && <p className="text-red-500 text-[10px] mt-1 ml-2">{errors.reservedTo}</p>}
              </div>
            </div>
          )}

          {/* Photo de couverture */}
          <div className="pt-2">
            <p className="text-[10px] text-gray-400 mb-3 ml-2 uppercase tracking-[0.2em] font-bold italic">Image de couverture</p>
            {!mainImage ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-100 p-12 rounded-4xl cursor-pointer bg-gray-50 hover:border-[#C3091C] transition-all group">
                <FiUpload className="text-[#C3091C] mb-3 text-2xl group-hover:scale-110 transition-transform" />
                <span className="text-[9px] text-gray-400 uppercase tracking-widest text-center font-bold">Importer la photo principale</span>
                <input type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" />
              </label>
            ) : (
              <div className="relative h-64 w-full rounded-4xl overflow-hidden shadow-md group">
                <img src={URL.createObjectURL(mainImage)} className="w-full h-full object-cover" alt="Cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <label className="cursor-pointer bg-white text-black px-6 py-2.5 rounded-full font-bold text-[10px] tracking-widest flex items-center gap-2">
                    <FiEdit2 size={12} /> REMPLACER
                    <input type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" />
                  </label>
                </div>
              </div>
            )}
            {errors.mainImage && <p className="text-red-500 text-[11px] mt-2 text-center">{errors.mainImage}</p>}
          </div>

          {/* Galerie */}
          <div className="space-y-3 pt-2">
            <p className="text-[10px] text-gray-400 ml-2 uppercase tracking-[0.2em] font-bold italic">Galerie photos</p>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              <label className="shrink-0 w-28 h-28 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-[#C3091C] bg-gray-50 transition-all">
                <FiPlus className="text-[#C3091C] text-xl" />
                <span className="text-[8px] text-gray-400 mt-1 uppercase font-black">Ajouter</span>
                <input type="file" accept="image/*" onChange={(e) => setImageFiles([...imageFiles, ...Array.from(e.target.files)])} multiple className="hidden" />
              </label>
              {imageFiles.map((file, index) => (
                <div key={index} className="relative shrink-0 w-28 h-28 rounded-3xl overflow-hidden shadow-sm">
                  <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setImageFiles(imageFiles.filter((_, i) => i !== index))} className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 shadow-md active:scale-90 transition-all"><FiX size={12} className="text-red-600"/></button>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="pt-2">
            <textarea name="description" placeholder="Description détaillée..." value={formData.description} onChange={handleChange} rows={5}
              className="w-full p-5 bg-gray-50 rounded-4xl text-sm outline-none border border-transparent focus:border-[#C3091C] resize-none" />
            {errors.description && <p className="text-red-500 text-[11px] mt-1 ml-2">{errors.description}</p>}
          </div>

          {/* Bouton de validation (Même style que Détails dans HouseCard) */}
          <div className="pt-4">
            <button 
              type="submit"
              disabled={loading} 
              className="w-full py-6 bg-[#C3091C] text-white rounded-4xl font-bold text-[12px] tracking-[0.4em] uppercase shadow-2xl hover:bg-black active:scale-[0.97] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  PUBLICATION EN COURS...
                </span>
              ) : (
                'ENREGISTRER LA PROPRIÉTÉ'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}