import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addHouseThunk } from '../store/housesSlice';
import { uploadImageToCloudinary } from '../services/cloudinary';
import toast from 'react-hot-toast';
import { FiUpload, FiHome, FiMapPin, FiDollarSign, FiMaximize2, FiX } from 'react-icons/fi';
import { GiBed, GiShower } from 'react-icons/gi';

export default function AddHouse() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.houses);

  // ------------------------------
  // State du formulaire
  // ------------------------------
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    price: '',
    description: '',
    rooms: '',
    bathrooms: '',
    surface: '',
    type: 'Appartement',
    status: 'available',
    reservedFrom: '',
    reservedTo: '',
  });

  // ------------------------------
  // Erreurs
  // ------------------------------
  const [errors, setErrors] = useState({});

  // ------------------------------
  // Images
  // ------------------------------
  const [mainImage, setMainImage] = useState(null); // photo principale
  const [imageFiles, setImageFiles] = useState([]); // images secondaires

  // ------------------------------
  // Champs du formulaire
  // ------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['price', 'rooms', 'bathrooms', 'surface'].includes(name)) {
      if (Number(value) < 0) return;
    }

    if (name === 'status' && value === 'available') {
      setFormData({ ...formData, status: value, reservedFrom: '', reservedTo: '' });
      setErrors({ ...errors, reservedFrom: '', reservedTo: '' });
      return;
    }

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  // ------------------------------
  // Images
  // ------------------------------
  const handleMainImageChange = (e) => {
    setMainImage(e.target.files[0]);
    setErrors({ ...errors, mainImage: '' });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);
    setErrors({ ...errors, image: '' });
  };

  const handleRemoveImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ------------------------------
  // Validation
  // ------------------------------
  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Le titre est requis';
    if (!formData.address) newErrors.address = "L'adresse est requise";
    if (!formData.price && formData.price !== 0) newErrors.price = 'Le prix est requis';
    if (!formData.surface && formData.surface !== 0) newErrors.surface = 'La surface est requise';
    if (!formData.rooms && formData.rooms !== 0) newErrors.rooms = 'Le nombre de chambres est requis';
    if (!formData.bathrooms && formData.bathrooms !== 0) newErrors.bathrooms = 'Le nombre de salles de bain est requis';
    if (!formData.description) newErrors.description = 'La description est requise';
    if (!mainImage) newErrors.mainImage = 'Veuillez ajouter la photo principale';

    if (formData.status === 'reserved') {
      if (!formData.reservedFrom) newErrors.reservedFrom = 'Date de début requise';
      if (!formData.reservedTo) newErrors.reservedTo = 'Date de fin requise';
      if (formData.reservedFrom && formData.reservedTo && formData.reservedFrom > formData.reservedTo) {
        newErrors.reservedTo = 'La date de fin doit être après la date de début';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ------------------------------
  // Envoi formulaire
  // ------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const uploadedImages = [];

      // Upload image principale
      const mainImageUrl = await uploadImageToCloudinary(mainImage);

      // Upload images secondaires
      for (const file of imageFiles) {
        const url = await uploadImageToCloudinary(file);
        uploadedImages.push(url);
      }

      const houseData = {
        ...formData,
        price: Number(formData.price),
        rooms: Number(formData.rooms),
        bathrooms: Number(formData.bathrooms),
        surface: Number(formData.surface),
        mainImage: mainImageUrl,
        images: uploadedImages,
        reservedFrom: formData.status === 'reserved' ? formData.reservedFrom : null,
        reservedTo: formData.status === 'reserved' ? formData.reservedTo : null,
      };

      await dispatch(addHouseThunk(houseData)).unwrap();
      toast.success('Maison ajoutée avec succès !');

      // Reset formulaire
      setFormData({
        title: '',
        address: '',
        price: '',
        description: '',
        rooms: '',
        bathrooms: '',
        surface: '',
        type: 'Appartement',
        status: 'available',
        reservedFrom: '',
        reservedTo: '',
      });
      setMainImage(null);
      setImageFiles([]);
      setErrors({});
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de l’ajout');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-2xl rounded-3xl mt-10">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-[#C3091C] tracking-wide">
        Ajouter une Maison
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {/* Titre */}
        <div className="relative">
          <FiHome className="absolute top-3 left-3 text-[#C3091C]" />
          <input
            type="text"
            name="title"
            placeholder="Titre"
            value={formData.title}
            onChange={handleChange}
            className={`border p-3 pl-10 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#C3091C] shadow-sm ${errors.title ? 'border-red-500' : ''}`}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Adresse */}
        <div className="relative">
          <FiMapPin className="absolute top-3 left-3 text-[#C3091C]" />
          <input
            type="text"
            name="address"
            placeholder="Adresse"
            value={formData.address}
            onChange={handleChange}
            className={`border p-3 pl-10 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#C3091C] shadow-sm ${errors.address ? 'border-red-500' : ''}`}
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>

        {/* Prix et Surface */}
        <div className="flex gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[120px]">
            <FiDollarSign className="absolute top-3 left-3 text-[#C3091C]" />
            <input
              type="number"
              name="price"
              placeholder="Prix"
              value={formData.price}
              onChange={handleChange}
              min={0}
              className={`border p-3 pl-10 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#C3091C] shadow-sm ${errors.price ? 'border-red-500' : ''}`}
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>
          <div className="relative flex-1 min-w-[120px]">
            <FiMaximize2 className="absolute top-3 left-3 text-[#C3091C]" />
            <input
              type="number"
              name="surface"
              placeholder="Surface (m²)"
              value={formData.surface}
              onChange={handleChange}
              min={0}
              className={`border p-3 pl-10 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#C3091C] shadow-sm ${errors.surface ? 'border-red-500' : ''}`}
            />
            {errors.surface && <p className="text-red-500 text-sm mt-1">{errors.surface}</p>}
          </div>
        </div>

        {/* Chambres et Salles de bain */}
        <div className="flex gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[120px]">
            <GiBed className="absolute top-3 left-3 text-[#C3091C]" />
            <input
              type="number"
              name="rooms"
              placeholder="Chambres"
              value={formData.rooms}
              onChange={handleChange}
              min={0}
              className={`border p-3 pl-10 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#C3091C] shadow-sm ${errors.rooms ? 'border-red-500' : ''}`}
            />
            {errors.rooms && <p className="text-red-500 text-sm mt-1">{errors.rooms}</p>}
          </div>
          <div className="relative flex-1 min-w-[120px]">
            <GiShower className="absolute top-3 left-3 text-[#C3091C]" />
            <input
              type="number"
              name="bathrooms"
              placeholder="Salles de bain"
              value={formData.bathrooms}
              onChange={handleChange}
              min={0}
              className={`border p-3 pl-10 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#C3091C] shadow-sm ${errors.bathrooms ? 'border-red-500' : ''}`}
            />
            {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>}
          </div>
        </div>

        {/* Type et Status */}
        <div className="flex gap-4 flex-wrap">
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-xl flex-1 focus:outline-none focus:ring-2 focus:ring-[#C3091C] shadow-sm min-w-[120px]"
          >
            <option>Appartement</option>
            <option>Villa</option>
            <option>Maison</option>
            <option>Studio</option>
          </select>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-xl flex-1 focus:outline-none focus:ring-2 focus:ring-[#C3091C] shadow-sm min-w-[120px]"
          >
            <option value="available">Disponible</option>
            <option value="reserved">Réservé</option>
          </select>
        </div>

        {/* Dates si réservé */}
        {formData.status === 'reserved' && (
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[120px]">
              <label className="block text-gray-700 mb-1">De :</label>
              <input
                type="date"
                name="reservedFrom"
                value={formData.reservedFrom}
                onChange={handleChange}
                className={`border p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#C3091C] shadow-sm ${errors.reservedFrom ? 'border-red-500' : ''}`}
              />
              {errors.reservedFrom && <p className="text-red-500 text-sm mt-1">{errors.reservedFrom}</p>}
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="block text-gray-700 mb-1">À :</label>
              <input
                type="date"
                name="reservedTo"
                value={formData.reservedTo}
                onChange={handleChange}
                className={`border p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#C3091C] shadow-sm ${errors.reservedTo ? 'border-red-500' : ''}`}
              />
              {errors.reservedTo && <p className="text-red-500 text-sm mt-1">{errors.reservedTo}</p>}
            </div>
          </div>
        )}

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={`border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C3091C] shadow-sm ${errors.description ? 'border-red-500' : ''}`}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}

        {/* Bouton Photo Principale */}
        <label
          htmlFor="main-image-upload"
          className={`flex items-center justify-center border-2 border-dashed p-4 rounded-xl cursor-pointer hover:bg-[#C3091C] hover:text-white transition-colors text-lg font-semibold text-gray-700 ${errors.mainImage ? 'border-red-500' : 'border-[#C3091C]'}`}
        >
          <FiUpload className="mr-2 text-2xl" />
          {mainImage ? 'Changer la photo principale' : 'Ajouter la photo principale'}
        </label>
        <input
          id="main-image-upload"
          type="file"
          accept="image/*"
          onChange={handleMainImageChange}
          className="hidden"
        />
        {errors.mainImage && <p className="text-red-500 text-sm mt-1">{errors.mainImage}</p>}

        {/* Aperçu Photo Principale */}
        {mainImage && (
          <div className="w-full h-64 mt-2 rounded-xl overflow-hidden border shadow-lg">
            <img
              src={URL.createObjectURL(mainImage)}
              alt="Main Preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Bouton Images Secondaires */}
        <label
          htmlFor="image-upload"
          className={`flex items-center justify-center border-2 border-dashed p-4 rounded-xl cursor-pointer hover:bg-[#C3091C] hover:text-white transition-colors text-gray-700 font-semibold`}
        >
          <FiUpload className="mr-2 text-xl" />
          Ajouter des images secondaires
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          multiple
          className="hidden"
        />
        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}

        {/* Aperçu Images Secondaires */}
        <div className="flex flex-wrap gap-3 mt-3">
          {imageFiles.map((file, index) => (
            <div key={index} className="relative w-24 h-24 border rounded-xl overflow-hidden shadow-lg">
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${index}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-white bg-opacity-70 text-red-600 rounded-full p-1 hover:bg-red-600 hover:text-white transition"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Bouton Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-[#C3091C] text-white py-3 rounded-xl font-semibold hover:bg-[#9f0815] transition-colors shadow-lg mt-4"
        >
          {loading ? 'Ajout...' : 'Ajouter la maison'}
        </button>
      </form>
    </div>
  );
}
