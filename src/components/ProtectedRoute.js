import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const tokenRef = ref(database, `users/${user.uid}/token`);
        onValue(tokenRef, (snapshot) => {
          const data = snapshot.val();
          const sessionToken = sessionStorage.getItem('userToken');
          console.log('ProtectedRoute - Firebase token:', data?.token);
          console.log('ProtectedRoute - Session token:', sessionToken);
          if (data && data.token && sessionToken && data.token === sessionToken) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            sessionStorage.removeItem('userToken'); // Clear invalid token
          }
          setLoading(false);
        }, { onlyOnce: true });
      } else {
        setIsAuthenticated(false);
        sessionStorage.removeItem('userToken');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;