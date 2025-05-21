import './styles/Technology.css';
import esp32Image from './assets/esp32-circuit.jpg'; // Adjust path as needed
import mathImage from './assets/math-diagram.jpg'; // Adjust path as needed

function Technology() {
  return (
    <section className="technology-section">
      <div className="technology-container">
        <h2 className="technology-title">Technology</h2>
        <div className="technology-content">
          {/* First Row: ESP32 Architecture (Text on Left, Image on Right) */}
          <div className="technology-row">
            <div className="technology-text-column">
              <h3 className="technology-subtitle">ESP32 Architecture</h3>
              <p className="technology-text">
                Our solutions leverage the powerful dual-core Xtensa LX6 microprocessor, running
                at 240 MHz, with integrated Wi-Fi and Bluetooth connectivity for seamless IoT
                integration.
              </p>
              <ul className="technology-features">
                <li>✔ Dual-core processing for parallel task execution</li>
                <li>✔ Ultra-low power consumption with multiple sleep modes</li>
                <li>✔ Integrated cryptographic hardware acceleration</li>
              </ul>
            </div>
            <div className="technology-image-column">
              <img src={esp32Image} alt="ESP32 Circuit" />
            </div>
          </div>
          {/* Second Row: Military-Grade Security (Image on Left, Text on Right) */}
          <div className="technology-row">
            <div className="technology-image-column">
              <img src={mathImage} alt="Math Diagram" />
            </div>
            <div className="technology-text-column">
              <h3 className="technology-subtitle">Military-Grade Security</h3>
              <p className="technology-text">
                We implement our own Military-Grade cryptographic algorithm in hardware for
                maximum security with minimal performance impact.
              </p>
              <div className="technology-security-features">
                <div className="security-item">
                  <span className="security-icon">🔒</span>
                  <div>
                    <h4>Secure Boot</h4>
                    <p>Verified firmware execution from boot to application</p>
                  </div>
                </div>
                <div className="security-item">
                  <span className="security-icon">🔑</span>
                  <div>
                    <h4>Flash Encryption</h4>
                    <p>256-bit encryption for all the data and code</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Technology;