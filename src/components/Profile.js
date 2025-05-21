import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, updateProfile, updateEmail } from 'firebase/auth';
import { ref, set, onValue } from 'firebase/database';
import { auth, database } from '../firebase';
import ReactCrop from 'react-image-crop';
import './styles/Profile.css';
import { useChipId } from '../ChipIdContext';
import 'react-image-crop/dist/ReactCrop.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [crop, setCrop] = useState({ unit: '%', width: 100, aspect: 1 });
  const [isCropping, setIsCropping] = useState(false);
  const [chipId, setChipId] = useState('');
  const [error, setError] = useState('');
  const imgRef = useRef(null);
  const navigate = useNavigate();
  const { setChipId: setContextChipId } = useChipId();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUsername(currentUser.displayName || '');
        setEmail(currentUser.email || '');
        setPreview(currentUser.photoURL || null);

        const userRef = ref(database, `users/${currentUser.uid}`);
        const unsubscribeValue = onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data && data.chipId) {
            setChipId(data.chipId);
            setContextChipId(data.chipId);
          }
        });
        return () => unsubscribeValue();
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate, setContextChipId]);

  const saveToFirebase = async (imageUrl = preview) => {
    if (user) {
      try {
        await set(ref(database, `users/${user.uid}`), {
          username: username,
          email: email,
          photoURL: imageUrl,
          chipId: chipId,
          timestamp: new Date().toISOString(),
        });
        setContextChipId(chipId);
        alert('Profile data saved to Firebase successfully');
      } catch (error) {
        console.error('Firebase save error:', error.message);
        alert('Failed to save profile data: ' + error.message);
      }
    }
  };

  const handleUsernameChange = async (e) => {
    e.preventDefault();
    if (user && username) {
      try {
        await updateProfile(user, { displayName: username });
        alert('Username updated successfully');
        await saveToFirebase();
      } catch (error) {
        console.error('Username update error:', error.message);
        alert('Failed to update username: ' + error.message);
      }
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    if (user && newEmail) {
      try {
        await updateEmail(user, newEmail);
        setEmail(newEmail);
        alert('Email updated successfully');
        await saveToFirebase();
      } catch (error) {
        console.error('Email update error:', error.message);
        alert('Failed to update email: ' + error.message);
      }
    }
  };

  const handleChipIdChange = async (e) => {
    e.preventDefault();
    if (user && chipId) {
      try {
        await saveToFirebase();
        alert('Chip ID updated successfully');
      } catch (error) {
        console.error('Chip ID save error:', error.message);
        alert('Failed to update chip ID: ' + error.message);
      }
    }
  };

  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'FYP_Project'); // Updated to correct preset name
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
      const imageUrl = result.secure_url;
      setPreview(imageUrl);
      setImage(null);
      setIsCropping(false);
      setError('');
      await updateProfile(user, { photoURL: imageUrl });
      await saveToFirebase(imageUrl);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit');
        return;
      }
      setImage(file);
      setIsCropping(true);
      setError('');
    }
  };

  const handleCropComplete = (crop) => {
    if (imgRef.current && crop.width && crop.height) {
      const canvas = document.createElement('canvas');
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        imgRef.current,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob(async (blob) => {
        if (!blob) {
          console.error('Failed to create blob from canvas');
          setError('Failed to process image for upload');
          return;
        }
        console.log('Blob created:', blob);
        const croppedFile = new File([blob], 'cropped.jpg', { type: 'image/jpeg' });
        await handleImageUpload(croppedFile);
      }, 'image/jpeg');
    }
  };

  const handleCropButtonClick = () => {
    handleCropComplete(crop);
  };

  const handleCropCancel = () => {
    setIsCropping(false);
    setImage(null);
    setCrop({ unit: '%', width: 100, aspect: 1 });
    setError('');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <section className="profile-section">
      <div className="profile-container">
        <h2 className="profile-title">Profile</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="profile-content">
          <div className="profile-box">
            <div className="profile-image">
              <h3>Profile Image</h3>
              {preview ? (
                <img src={preview} alt="Profile Preview" className="profile-preview" />
              ) : (
                <div className="profile-no-image">No Image Uploaded</div>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {isCropping && image && (
                <div className="profile-crop-editor">
                  <ReactCrop
                    crop={crop}
                    onChange={(newCrop) => setCrop(newCrop)}
                    onComplete={(c) => setCrop(c)}
                    aspect={1}
                  >
                    <img ref={imgRef} src={URL.createObjectURL(image)} alt="Crop" />
                  </ReactCrop>
                  <div className="crop-buttons">
                    <button className="crop-button" onClick={handleCropButtonClick}>
                      Crop
                    </button>
                    <button className="cancel-button" onClick={handleCropCancel}>
                      Cancel Crop
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="profile-details">
              <h3>Account Details</h3>
              <form onSubmit={handleUsernameChange} className="profile-form">
                <label>
                  Username:
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="profile-input"
                  />
                </label>
                <button type="submit" className="profile-button">
                  Update Username
                </button>
              </form>
              <form onSubmit={handleEmailChange} className="profile-form">
                <label className="profile-email-label">Current Email: {email}</label>
                <br />
                <label>
                  New Email:
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter new email"
                    className="profile-input"
                  />
                </label>
                <button type="submit" className="profile-button">
                  Update Email
                </button>
              </form>
              <form onSubmit={handleChipIdChange} className="profile-form">
                <label className='profile-chip-label'>
                  ESP32 Chip ID:
                  <input
                    type="text"
                    value={chipId}
                    onChange={(e) => setChipId(e.target.value)}
                    placeholder="Enter chip ID (e.g., 000098CA4A3B015C)"
                    className="profile-input"
                  />
                </label>
                <button type="submit" className="profile-chip-button">
                  Save Chip ID
                </button>
              </form>
            </div>
            <div className="profile-sensors">
              <h3>Connected Sensors</h3>
              <ul>
                <li>Oximeter</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;