import './styles/Highlights.css';

import key from './assets/key.png';
import chip from './assets/chip.png';
import battery from './assets/battery.png';


function Highlights() {
  return (
    <section className="highlights-section">
      <div className="highlights-container">
        <div className="highlights-grid">
          <div className="highlights-item">
            <img src={key} alt="Advanced Encryption" className="highlights-icon" />
            <h3 className="highlights-title">Advanced Encryption</h3>
            <p className="highlights-text">Military-grade security protocols for your IoMT devices</p>
          </div>
          <div className="highlights-item">
            <img src={chip} alt="High Performance" className="highlights-icon" />
            <h3 className="highlights-title">High Performance</h3>
            <p className="highlights-text">Optimized processing for real-time data handling</p>
          </div>
          <div className="highlights-item">
            <img src={battery} alt="Power Efficient" className="highlights-icon" />
            <h3 className="highlights-title">Power Efficient</h3>
            <p className="highlights-text">Ultra-low power consumption for extended operation</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Highlights;