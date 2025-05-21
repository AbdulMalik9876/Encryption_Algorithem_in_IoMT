import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, onValue, set, remove } from 'firebase/database';
import { auth, database } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import './styles/Login.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [notification, setNotification] = useState({ message: '', type: '' }); // State for popup message with type
  const navigate = useNavigate();
  const inactivityTimeoutRef = useState(null);

  const generateAndStoreToken = async (userId) => {
    const newToken = uuidv4();
    console.log('Generated token on login:', newToken);

    await set(ref(database, `users/${userId}/token`), {
      token: newToken,
      createdAt: new Date().toISOString(),
    });

    sessionStorage.setItem('userToken', newToken);
    return newToken;
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

  const deleteToken = async (userId) => {
    await remove(ref(database, `users/${userId}/token`));
    sessionStorage.removeItem('userToken');
    console.log('Token deleted');
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 2000);
  };

  useEffect(() => {
    let userId = null;
    const token = sessionStorage.getItem('userToken');
    if (token) {
      console.log('Token found in sessionStorage:', token);
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
  },);

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
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      console.log('User logged in:', user.uid);

      const tokenRef = ref(database, `users/${user.uid}/token`);
      await new Promise((resolve) => {
        onValue(tokenRef, async (snapshot) => {
          const data = snapshot.val();
          if (data && data.token) {
            console.log('Token found in Firebase:', data.token);
            sessionStorage.setItem('userToken', data.token);
          } else {
            console.log('No token found for user, generating a new one...');
            await generateAndStoreToken(user.uid);
          }
          resolve();
        }, { onlyOnce: true });
      });

      showNotification('Logged in successfully!', 'success');
      setTimeout(() => {
        navigate('/profile');
      }, 500);
    } catch (error) {
      console.error('Login error:', error.message);
      showNotification('Login failed: ' + error.message, 'error');
    }
  };

  return (
    <section className="login-section">
      <div className="login-container">
        <h2 className="login-title">Log In</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-label">
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="login-input"
            />
          </label>
          <label className="login-label">
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="login-input"
            />
          </label>
          <button type="submit" className="login-button">Log In</button>
          <p className="login-text">
            Don’t have an account? <Link to="/signup" className="login-link">Sign Up</Link>
          </p>
        </form>
        {notification.message && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}
      </div>
    </section>
  );
}

export default Login;