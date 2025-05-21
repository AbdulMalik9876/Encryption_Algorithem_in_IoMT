import { useState } from 'react';
import './styles/Hero.css';
import ContactUsPopup from './ContactUsPopup'; // Adjust path based on your project structure

function Hero() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleContactClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <section className="hero-section">
      <div className="hero-container">
        <h1 className="hero-title">Advanced ESP32 Sensor Encryption Solutions</h1>
        <p className="hero-subtitle">Secure, efficient, and scalable IoT solutions with military-grade cryptography</p>
        <button className="hero-button" onClick={handleContactClick}>Contact Us</button>
      </div>
      {isPopupOpen && <ContactUsPopup onClose={handleClosePopup} />}
    </section>
  );
}

export default Hero;