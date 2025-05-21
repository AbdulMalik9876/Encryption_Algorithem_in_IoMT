import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Technology from './components/Technology';
import Features from './components/Features';
import About from './components/About';
import OximeterData from './components/OximeterData';
import Profile from './components/Profile';
import Login from './components/Login';
import Signup from './components/Signup';
import Footer from './components/Footer';
import { ChipIdProvider } from './ChipIdContext';
// import CloudinaryUpload from './components/CloudinaryUpload';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

function App() {
  return (
    <Router>
      <ChipIdProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/oximeter" element={<ProtectedRoute><OximeterData /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/upload" element={<CloudinaryUpload />} /> */}
        </Routes>
        <Footer />
      </ChipIdProvider>
    </Router>
  );
}

export default App;