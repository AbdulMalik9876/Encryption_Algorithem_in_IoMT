import { Link } from 'react-router-dom';
import './styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-sections">
          <div className="footer-section">
            <h3 className="footer-title">About Us</h3>
            <p className="footer-text">Leading provider of ESP32-based IoMT advanced cryptography solutions</p>
          </div>
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-list">
              <li className="footer-item"><Link to="/technology" className="footer-link">Technology</Link></li>
              <li className="footer-item"><Link to="/features" className="footer-link">Features</Link></li>
              <li className="footer-item"><Link to="/about" className="footer-link">About</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3 className="footer-title">Contact</h3>
            <p className="footer-text">info@example.com</p>
            <p className="footer-text">+92 318 0971788</p>
            <p className="footer-text">Sir Syed CASE Institute of Technology</p>
          </div>
          <div className="footer-section">
            <h3 className="footer-title">Newsletter</h3>
            <form className="footer-form">
              <input type="email" placeholder="Your email" required className="footer-input" />
              <button type="submit" className="footer-button">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;