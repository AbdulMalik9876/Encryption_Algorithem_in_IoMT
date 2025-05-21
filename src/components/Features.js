import { useState } from 'react';
import './styles/Features.css';
import zap from './assets/zap.png';
import Shield from './assets/shield.png';
import battery from './assets/battery.png';
import cloud from './assets/cloud.png';
import chip from './assets/chip.png';
import hardware from './assets/hardware.png';
import ContactUsPopup from '../components/ContactUsPopup'; // Adjust path as needed

function Features() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleContactClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <section className="features-section">
      <div className="features-container">
        <h2 className="features-title">Key Features</h2>
        <p className="features-text">Discover the powerful capabilities of our ESP32-based solutions</p>
        <div className="features-grid">
          <div className="features-item">
            <img src={zap} alt="Real-time Processing" className="features-icon" />
            <h3 className="features-heading">Real-time Processing</h3>
            <p className="features-text">Dual-core architecture enables parallel processing of sensor data and communication tasks with minimal latency.</p>
          </div>
          <div className="features-item">
            <img src={Shield} alt="End-to-End Encryption" className="features-icon" />
            <h3 className="features-heading">End-to-End Encryption</h3>
            <p className="features-text">All data is encrypted at the sensor level using AES-256 before transmission to the cloud.</p>
          </div>
          <div className="features-item">
            <img src={battery} alt="Low Power Operation" className="features-icon" />
            <h3 className="features-heading">Low Power Operation</h3>
            <p className="features-text">Advanced power management extends battery life to years in field deployments.</p>
          </div>
          <div className="features-item">
            <img src={cloud} alt="Cloud Integration" className="features-icon" />
            <h3 className="features-heading">Cloud Integration</h3>
            <p className="features-text">Seamless connectivity with major cloud platforms including AWS IoT and Azure IoT Hub.</p>
          </div>
          <div className="features-item">
            <img src={chip} alt="Hardware Acceleration" className="features-icon" />
            <h3 className="features-heading">Hardware Acceleration</h3>
            <p className="features-text">Dedicated cryptographic processors for secure operations without performance penalty.</p>
          </div>
          <div className="features-item">
            <img src={hardware} alt="Modular Design" className="features-icon" />
            <h3 className="features-heading">Modular Design</h3>
            <p className="features-text">Customizable sensor arrays and communication modules for diverse applications.</p>
          </div>
        </div>
        <div className="features-cta">
          <h3 className="features-heading-cta">Ready to Get Started?</h3>
          <p className="features-text-cta">Choose the perfect solution for your IoT needs with our flexible deployment options.</p>
          <button className="features-button" onClick={handleContactClick}>Contact Us</button>
        </div>
      </div>
      {isPopupOpen && <ContactUsPopup onClose={handleClosePopup} />}
    </section>
  );
}

export default Features;