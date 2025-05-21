// src/config/cloudinary.js
const CLOUDINARY_CONFIG = {
  cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'serenaproject',
  uploadPreset: 'unsigned_upload',
};

export default CLOUDINARY_CONFIG;