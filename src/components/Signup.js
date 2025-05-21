import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set, remove } from 'firebase/database';
import { auth, database } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import './styles/Signup.css';

function Signup() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [setToken] = useState(null);
  const [notification, setNotification] = useState(''); // State for popup message
  const inactivityTimeoutRef = useState(null);

  // Function to show notification and auto-dismiss after 2 seconds
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification('');
    }, 2000); // 2 seconds
  };

  const generateAndStoreToken = async (userId) => {
    const newToken = uuidv4();
    console.log('Generated token:', newToken);

    await set(ref(database, `users/${userId}/token`), {
      token: newToken,
      createdAt: new Date().toISOString(),
    });

    sessionStorage.setItem('userToken', newToken);
    setToken(newToken);

    return newToken;
  };

  const deleteToken = async (userId) => {
    if (!userId) return;

    await remove(ref(database, `users/${userId}/token`));
    console.log('Token deleted from Firebase');

    sessionStorage.removeItem('userToken');
    setToken(null);
    console.log('Token deleted from sessionStorage');
  };

  const resetInactivityTimer = (userId) => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }

    inactivityTimeoutRef.current = setTimeout(() => {
      console.log('User inactive for 10 minutes, deleting token...');
      deleteToken(userId);
    }, 10 * 60 * 1000);
  };

  useEffect(() => {
    let userId = null;
    const tokenFromStorage = sessionStorage.getItem('userToken');
    if (tokenFromStorage) {
      setToken(tokenFromStorage);
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        userId = user.uid;
        resetInactivityTimer(userId);
      }
    });

    const handleActivity = () => {
      if (userId) {
        resetInactivityTimer(userId);
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
      unsubscribe();
    };
  });

  useEffect(() => {
    const handleBeforeUnload = async () => {
      const user = auth.currentUser;
      if (user) {
        await deleteToken(user.uid);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  },);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Attempting to sign up with email:', formData.email);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      console.log('User signed up successfully:', user.uid);

      await generateAndStoreToken(user.uid);

      await set(ref(database, 'users/' + user.uid), {
        email: formData.email,
        createdAt: new Date().toISOString(),
      });
      console.log('User data stored in database');

      showNotification('Sign-up successful! You can now log in.');
    } catch (error) {
      console.error('Sign-up error details:', error.code, error.message);
      showNotification('Sign-up failed: ' + error.message);
    }
  };

  return (
    <section className="signup-section">
      <div className="signup-container">
        <h2 className="signup-title">Sign Up</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <label className="signup-label">
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="signup-input"
            />
          </label>
          <label className="signup-label">
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="signup-input"
            />
          </label>
          <button type="submit" className="signup-button">Sign Up</button>
          <p className="signup-text">
            Already have an account? <Link to="/login" className="signup-link">Log In</Link>
          </p>
        </form>
        {notification && (
          <div className="notification">
            {notification}
          </div>
        )}
      </div>
    </section>
  );
}

export default Signup;