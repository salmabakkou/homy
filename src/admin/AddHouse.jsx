import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addHouseThunk } from '../store/housesSlice';
import { uploadImageToCloudinary } from '../services/cloudinary';
import toast from 'react-hot-toast';
import { 
  FiUpload, FiHome, FiMapPin, FiDollarSign, FiMaximize, 
  FiX, FiCalendar, FiPlus, FiEdit2, FiLayers, FiChevronDown 
} from 'react-icons/fi';
import { FaBed, FaBath } from 'react-icons/fa';

export default function AddHouse() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.houses);

  // Date d'aujourd'hui au format YYYY-MM-DD pour le "min" du calendrier
  const today = new Date().toISOString().split('T')[0];

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
    const { name, value, type } = e.target;
    if (type === 'number' && value < 0) return;
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
      toast.error("Erreur");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-10 flex flex-col items-center md:items-start">
          <span className="text-[#C3091C] font-serif text-3xl tracking-widest uppercase font-bold">Homy</span>
          <h1 className="text-[10px] text-gray-400 tracking-[0.3em] uppercase mt-1 italic font-bold">
            Dashboard / Création de Fiche
          </h1>
        </div>

        <div className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-xl border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-7">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Titre</label>
                <div className="relative">
                  <FiHome className="absolute top-4 left-4 text-[#C3091C]" />
                  <input type="text" name="title" value={formData.title} onChange={handleChange}
                    className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C] transition-all" />
                </div>
                {errors.title && <p className="text-red-500 text-[10px] mt-1 ml-2">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Adresse</label>
                <div className="relative">
                  <FiMapPin className="absolute top-4 left-4 text-[#C3091C]" />
                  <input type="text" name="address" value={formData.address} onChange={handleChange}
                    className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C] transition-all" />
                </div>
                {errors.address && <p className="text-red-500 text-[10px] mt-1 ml-2">{errors.address}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Prix (MAD)</label>
                <div className="relative">
                  <FiDollarSign className="absolute top-4 left-4 text-[#C3091C] text-xs" />
                  <input type="number" name="price" min="0" value={formData.price} onChange={handleChange}
                    className="w-full p-3.5 pl-10 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C]" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Surface (m²)</label>
                <div className="relative">
                  <FiMaximize className="absolute top-4 left-4 text-[#C3091C] text-xs" />
                  <input type="number" name="surface" min="0" value={formData.surface} onChange={handleChange}
                    className="w-full p-3.5 pl-10 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C]" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Chambres</label>
                <div className="relative">
                  <FaBed className="absolute top-4 left-4 text-[#C3091C] text-xs" />
                  <input type="number" name="rooms" min="0" value={formData.rooms} onChange={handleChange}
                    className="w-full p-3.5 pl-10 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C]" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">S. de Bain</label>
                <div className="relative">
                  <FaBath className="absolute top-4 left-4 text-[#C3091C] text-xs" />
                  <input type="number" name="bathrooms" min="0" value={formData.bathrooms} onChange={handleChange}
                    className="w-full p-3.5 pl-10 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C]" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Type de bien</label>
                <div className="relative">
                  <FiLayers className="absolute top-4 left-4 text-[#C3091C]" />
                  <select name="type" value={formData.type} onChange={handleChange} 
                    className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none appearance-none border border-transparent focus:border-[#C3091C] cursor-pointer">
                    <option>Appartement</option><option>Villa</option><option>Maison</option><option>Studio</option>
                  </select>
                  <FiChevronDown className="absolute top-4 right-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Disponibilité</label>
                <div className="relative">
                  <select name="status" value={formData.status} onChange={handleChange} 
                    className="w-full p-4 bg-gray-50 rounded-2xl text-sm outline-none appearance-none border border-transparent focus:border-[#C3091C] cursor-pointer">
                    <option value="available">Disponible</option><option value="reserved">Réservé</option>
                  </select>
                  <FiChevronDown className="absolute top-4 right-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {formData.status === 'reserved' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Du (Date minimum : Aujourd'hui)</label>
                  <div className="relative">
                    <FiCalendar className="absolute top-4 left-4 text-[#C3091C] z-10 pointer-events-none" />
                    <input type="date" name="reservedFrom" min={today} value={formData.reservedFrom} onChange={handleChange}
                      className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Au</label>
                  <div className="relative">
                    <FiCalendar className="absolute top-4 left-4 text-[#C3091C] z-10 pointer-events-none" />
                    <input type="date" name="reservedTo" min={formData.reservedFrom || today} value={formData.reservedTo} onChange={handleChange}
                      className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C]" />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Image de couverture</label>
              {!mainImage ? (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-100 h-48 rounded-4xl cursor-pointer bg-gray-50 hover:border-[#C3091C] transition-all group">
                  <FiUpload className="text-[#C3091C] mb-3 text-2xl" />
                  <span className="text-[9px] text-gray-400 uppercase tracking-widest font-black">Cliquer pour uploader</span>
                  <input type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" />
                </label>
              ) : (
                <div className="relative h-64 w-full rounded-4xl overflow-hidden shadow-lg group">
                  <img src={URL.createObjectURL(mainImage)} className="w-full h-full object-cover" alt="Cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <label className="cursor-pointer bg-white text-black px-6 py-2.5 rounded-full font-bold text-[10px] tracking-widest flex items-center gap-2">
                      <FiEdit2 size={12} /> MODIFIER
                      <input type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" />
                    </label>
                  </div>
                </div>
              )}
              {errors.mainImage && <p className="text-red-500 text-[10px] mt-2 text-center">{errors.mainImage}</p>}
            </div>

            <div className="space-y-3">
              <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Galerie photos</label>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-1">
                <label className="shrink-0 w-28 h-28 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-[#C3091C] bg-gray-50">
                  <FiPlus className="text-[#C3091C] text-2xl" />
                  <input type="file" accept="image/*" onChange={(e) => setImageFiles([...imageFiles, ...Array.from(e.target.files)])} multiple className="hidden" />
                </label>
                {imageFiles.map((file, index) => (
                  <div key={index} className="relative shrink-0 w-28 h-28 rounded-3xl overflow-hidden shadow-md group">
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setImageFiles(imageFiles.filter((_, i) => i !== index))} 
                      className="absolute inset-0 bg-red-600/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <FiX size={20} className="text-white"/>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 ml-2 uppercase font-bold italic">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange}
                className="w-full p-6 bg-gray-50 rounded-4xl text-sm outline-none border border-transparent focus:border-[#C3091C] h-32 resize-none transition-all" />
              {errors.description && <p className="text-red-500 text-[10px] mt-1 ml-2">{errors.description}</p>}
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#C3091C] text-white py-6 rounded-4xl font-bold text-[11px] tracking-[0.4em] uppercase shadow-2xl hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50">
              {loading ? 'PUBLICATION...' : 'ENREGISTRER LA PROPRIÉTÉ'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}