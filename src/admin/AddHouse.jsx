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
      toast.error("Erreur");
    }
  };

  return (
    <div className="w-full md:max-w-4xl md:mx-auto bg-white md:border md:border-gray-100 md:shadow-sm md:rounded-[2.5rem] p-5 md:p-10 my-0 md:my-10">
      
      {/* Header */}
      <div className="text-center mb-8 md:mb-10">
        <span className="text-[#C3091C] font-serif text-3xl md:text-4xl tracking-[0.2em] uppercase">Homy</span>
        <h1 className="text-[10px] text-gray-400 tracking-[0.3em] uppercase mt-1">Nouvelle Propriété</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
        
        {/* Ligne 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="relative">
            <FiHome className="absolute top-4 left-4 text-[#C3091C]" />
            <input type="text" name="title" placeholder="Titre" value={formData.title} onChange={handleChange}
              className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C]" />
            {errors.title && <p className="text-red-500 text-[11px] mt-1 ml-2">{errors.title}</p>}
          </div>
          <div className="relative">
            <FiMapPin className="absolute top-4 left-4 text-[#C3091C]" />
            <input type="text" name="address" placeholder="Adresse" value={formData.address} onChange={handleChange}
              className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C]" />
            {errors.address && <p className="text-red-500 text-[11px] mt-1 ml-2">{errors.address}</p>}
          </div>
        </div>

        {/* Chiffres - 2 colonnes même sur petit mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="relative">
            <FiDollarSign className="absolute top-4 left-4 text-[#C3091C] text-xs" />
            <input type="number" name="price" placeholder="Prix" value={formData.price} onChange={handleChange}
              className="w-full p-3.5 pl-10 bg-gray-50 rounded-2xl text-sm outline-none" />
            {errors.price && <p className="text-red-500 text-[10px] mt-1">{errors.price}</p>}
          </div>
          <div className="relative">
            <FiMaximize className="absolute top-4 left-4 text-[#C3091C] text-xs" />
            <input type="number" name="surface" placeholder="m²" value={formData.surface} onChange={handleChange}
              className="w-full p-3.5 pl-10 bg-gray-50 rounded-2xl text-sm outline-none" />
            {errors.surface && <p className="text-red-500 text-[10px] mt-1">{errors.surface}</p>}
          </div>
          <div className="relative">
            <FaBed className="absolute top-4 left-4 text-[#C3091C] text-xs" />
            <input type="number" name="rooms" placeholder="Lits" value={formData.rooms} onChange={handleChange}
              className="w-full p-3.5 pl-10 bg-gray-50 rounded-2xl text-sm outline-none" />
            {errors.rooms && <p className="text-red-500 text-[10px] mt-1">{errors.rooms}</p>}
          </div>
          <div className="relative">
            <FaBath className="absolute top-4 left-4 text-[#C3091C] text-xs" />
            <input type="number" name="bathrooms" placeholder="Bains" value={formData.bathrooms} onChange={handleChange}
              className="w-full p-3.5 pl-10 bg-gray-50 rounded-2xl text-sm outline-none" />
            {errors.bathrooms && <p className="text-red-500 text-[10px] mt-1">{errors.bathrooms}</p>}
          </div>
        </div>

        {/* Type & Statut */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <select name="type" value={formData.type} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl text-sm outline-none">
            <option>Appartement</option><option>Villa</option><option>Maison</option><option>Studio</option>
          </select>
          <select name="status" value={formData.status} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl text-sm outline-none">
            <option value="available">Disponible</option><option value="reserved">Réservé</option>
          </select>
        </div>

        {/* Dates */}
        {formData.status === 'reserved' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <FiCalendar className="absolute top-4 left-4 text-[#C3091C] z-10 pointer-events-none" />
              <input type="date" name="reservedFrom" value={formData.reservedFrom} onChange={handleChange}
                className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C] [&::-webkit-calendar-picker-indicator]:opacity-0" />
              {errors.reservedFrom && <p className="text-red-500 text-[10px] mt-1 ml-2">{errors.reservedFrom}</p>}
            </div>
            <div className="relative">
              <FiCalendar className="absolute top-4 left-4 text-[#C3091C] z-10 pointer-events-none" />
              <input type="date" name="reservedTo" value={formData.reservedTo} onChange={handleChange}
                className="w-full p-4 pl-12 bg-gray-50 rounded-2xl text-sm outline-none border border-transparent focus:border-[#C3091C] [&::-webkit-calendar-picker-indicator]:opacity-0" />
              {errors.reservedTo && <p className="text-red-500 text-[10px] mt-1 ml-2">{errors.reservedTo}</p>}
            </div>
          </div>
        )}

        {/* Photo de couverture */}
        <div className="pt-2">
          <p className="text-[11px] text-gray-400 mb-3 ml-2 uppercase tracking-[0.2em] font-medium">Couverture</p>
          {!mainImage ? (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-100 p-10 md:p-14 rounded-3xl cursor-pointer bg-gray-50 hover:border-[#C3091C] transition-all">
              <FiUpload className="text-[#C3091C] mb-3 text-2xl" />
              <span className="text-[10px] text-gray-400 uppercase tracking-widest text-center">Ajouter l'image principale</span>
              <input type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" />
            </label>
          ) : (
            <div className="relative h-56 md:h-72 w-full rounded-3xl overflow-hidden group shadow-md">
              <img src={URL.createObjectURL(mainImage)} className="w-full h-full object-cover" alt="Cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <label className="cursor-pointer bg-white text-black px-6 py-2.5 rounded-full font-bold text-[10px] tracking-widest flex items-center gap-2">
                  <FiEdit2 size={12} /> CHANGER
                  <input type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" />
                </label>
              </div>
            </div>
          )}
          {errors.mainImage && <p className="text-red-500 text-[11px] mt-2 text-center">{errors.mainImage}</p>}
        </div>

        {/* Galerie */}
        <div className="space-y-3 pt-2">
          <p className="text-[11px] text-gray-400 ml-2 uppercase tracking-[0.2em] font-medium">Galerie photos</p>
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide px-1">
            <label className="shrink-0 w-24 h-24 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#C3091C] bg-gray-50">
              <FiPlus className="text-[#C3091C] text-xl" />
              <span className="text-[8px] text-gray-400 mt-1 uppercase font-bold">Ajouter</span>
              <input type="file" accept="image/*" onChange={(e) => setImageFiles([...imageFiles, ...Array.from(e.target.files)])} multiple className="hidden" />
            </label>
            {imageFiles.map((file, index) => (
              <div key={index} className="relative shrink-0 w-24 h-24 rounded-2xl overflow-hidden shadow-sm">
                <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                <button type="button" onClick={() => setImageFiles(imageFiles.filter((_, i) => i !== index))} className="absolute top-1 right-1 bg-white/90 rounded-full p-1.5 shadow-sm"><FiX size={10} className="text-red-600"/></button>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="pt-2">
          <textarea name="description" placeholder="Description de la propriété..." value={formData.description} onChange={handleChange} rows={4}
            className="w-full p-5 bg-gray-50 rounded-3xl text-sm outline-none border border-transparent focus:border-[#C3091C] resize-none" />
          {errors.description && <p className="text-red-500 text-[11px] mt-1 ml-2">{errors.description}</p>}
        </div>

        {/* Bouton */}
        <button type="submit" disabled={loading} className="w-full bg-[#C3091C] text-white py-5 rounded-2xl md:rounded-3xl font-bold text-[11px] tracking-[0.3em] uppercase shadow-xl hover:brightness-110 active:scale-[0.99] transition-all">
          {loading ? 'Publication...' : 'Enregistrer la propriété'}
        </button>
      </form>
    </div>
  );
}