export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(import.meta.env.VITE_CLOUDINARY_URL, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  return data.secure_url;
};
