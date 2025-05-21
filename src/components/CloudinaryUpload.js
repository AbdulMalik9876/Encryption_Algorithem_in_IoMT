import React, { useState } from 'react';

function CloudinaryUpload() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'unsigned_upload');
      formData.append('folder', 'FYP');

      const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
      console.log('Cloudinary cloud name:', cloudName);

      if (!cloudName) {
        throw new Error('Cloudinary cloud name is not set in environment variables');
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      console.log('Cloudinary response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cloudinary error response:', errorText);
        throw new Error(`Failed to upload image to Cloudinary: ${errorText}`);
      }

      const result = await response.json();
      console.log('Cloudinary upload result:', result);
      setImageUrl(result.secure_url);
      setError('');
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '120px' }}>
      <h2>Cloudinary Image Upload</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file}>
        Upload Image
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {imageUrl && (
        <div>
          <p>Uploaded Image URL: <a href={imageUrl} target="_blank" rel="noopener noreferrer">{imageUrl}</a></p>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '300px' }} />
        </div>
      )}
    </div>
  );
}

export default CloudinaryUpload;