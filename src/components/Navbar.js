import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, onValue } from 'firebase/database'; // Add onValue to check token
import { auth, database } from '../firebase';
import logo from './assets/logo.png';
import './styles/Navbar.css';

function Navbar() {
  const [user, setUser] = useState(null);
  const [hasValidToken, setHasValidToken] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const tokenRef = ref(database, `users/${currentUser.uid}/token`);
        onValue(tokenRef, (snapshot) => {
          const data = snapshot.val();
          const sessionToken = sessionStorage.getItem('userToken');
          console.log('Firebase token:', data?.token);
          console.log('Session token:', sessionToken);
          setHasValidToken(data && data.token && sessionToken && data.token === sessionToken);
        }, { onlyOnce: true });
      } else {
        setHasValidToken(false);
        sessionStorage.removeItem('userToken'); // Clear session token if no user
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      sessionStorage.removeItem('userToken'); // Clear token on sign out
      setHasValidToken(false);
      alert('Signed out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Sign-out error:', error.message);
      alert('Sign-out failed: ' + error.message);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <img src={logo} alt="logo" className="navbar-logo-img" />
          </Link>
          <ul className="navbar-list">
            <li className="navbar-item"><Link to="/" className="navbar-link">Home</Link></li>
            <li className="navbar-item"><Link to="/technology" className="navbar-link">Technology</Link></li>
            <li className="navbar-item"><Link to="/features" className="navbar-link">Features</Link></li>
            <li className="navbar-item"><Link to="/about" className="navbar-link">About</Link></li>
            {hasValidToken && (
              <>
                <li className="navbar-item"><Link to="/oximeter" className="navbar-link">Oximeter</Link></li>
                {/* <li className="navbar-item"><Link to="/profile" className="navbar-link">Profile</Link></li> */}
              </>
            )}
          </ul>
        </div>

        <div className="navbar-right">
          {hasValidToken ? (
            <>
              <div className="navbar-user-info">
                <Link to="/profile" className="navbar-user-info">
                {user.photoURL && <img src={user.photoURL} alt="Profile" className="navbar-user-image" />}
                </Link>
                <Link to="/profile" className="navbar-user-info">
                <span className="navbar-user-name">{user.displayName || 'User'}</span>
                </Link>
              </div>
              <button onClick={handleSignOut} className="navbar-button signout">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-button">Login</Link>
              <Link to="/signup" className="navbar-button signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;