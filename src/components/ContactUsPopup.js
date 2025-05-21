import { useState } from 'react';
import './styles/ContactUsPopup.css'; // Adjust path based on your project structure
import am from './assets/am.jpg'; // Adjust path based on your project structure
import hassan from './assets/hassan.jpg';

const ContactUsPopup = ({ onClose }) => {
  const [copiedField, setCopiedField] = useState(null);

  const contactInfo = [
    {
      name: 'Abdul Malik',
      role: 'Founder',
      email: 'amabbaxi9876@gmail.com',
      phone: '+92-318-0971788',
      image: am,
    },
    {
      name: 'M. Hassan Mehmood',
      role: 'Co-Founder',
      email: 'mhassankhokhar476@gmail.com',
      phone: '+92-349-9194480',
      image: hassan,
    },
  ];

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="popup-title">Contact Us</h2>
        <button className="popup-close" onClick={onClose}>×</button>
        <div className="popup-team">
          {contactInfo.map((member, index) => (
            <div key={index} className="popup-member">
              <img src={member.image} alt={member.name} className="popup-image" />
              <h4 className="popup-name">{member.name}</h4>
              <p className="popup-role">{member.role}</p>
              <div className="popup-email-container">
                <p className="popup-email">Email: {member.email}</p>
                <button
                  className={`copy-button ${copiedField === `email-${index}` ? 'copied' : ''}`}
                  onClick={() => handleCopy(member.email, `email-${index}`)}
                >
                  {copiedField === `email-${index}` ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="popup-phone-container">
                <p className="popup-phone">Phone: {member.phone}</p>
                <button
                  className={`copy-button ${copiedField === `phone-${index}` ? 'copied' : ''}`}
                  onClick={() => handleCopy(member.phone, `phone-${index}`)}
                >
                  {copiedField === `phone-${index}` ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactUsPopup;