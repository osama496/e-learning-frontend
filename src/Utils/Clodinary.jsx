const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dbk7qkzsr/image/upload';
const UPLOAD_PRESET = 'e-learning'; // Your Cloudinary unsigned preset
const CLOUD_NAME = 'dbk7qkzsr';

export const uploadImageToCloudinary = async (file) => {
  // Create a FormData object
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('cloud_name', CLOUD_NAME);

  try {
    // Make the POST request to Cloudinary API
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Image upload failed');
    }

    const data = await response.json();
    return data.secure_url; // Return the URL of the uploaded image
  } catch (error) {
    console.error('Error uploading image to Cloudinary', error);
    throw error;
  }
};
