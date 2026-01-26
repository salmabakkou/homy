export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'homy_project');

  const res = await fetch(
    'https://api.cloudinary.com/v1_1/dodacbzhu/image/upload',
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await res.json();
  return data.secure_url;
};
