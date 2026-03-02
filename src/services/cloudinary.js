import axios from 'axios';

export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  const res = await axios.post(import.meta.env.VITE_CLOUDINARY_URL, formData);

  return res.data.secure_url;
};
