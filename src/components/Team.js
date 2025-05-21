import './styles/Team.css';
import am from './assets/am.jpg';
import hassan from './assets/hassan.jpg';

function Team() {
  return (
    <div className="team-container">
      <h3 className="team-title">Our Team</h3>
      <div className="team-members">
        <div className="team-member">
          <img src={am} alt="Abdul Malik" className="team-image" />
          <h4 className="team-name">Abdul Malik</h4>
          <p className="team-role">Founder</p>
          <p className="team-bio">Former cybersecurity researcher with 15+ years in embedded systems</p>
        </div>
        <div className="team-member">
          <img src={hassan} alt="M. Hassan Mehmood" className="team-image" />
          <h4 className="team-name">M. Hassan Mehmood</h4>
          <p className="team-role">Co-Founder</p>
          <p className="team-bio">IoT architect specializing and cryptographic Expert with 10+ years of Experience</p>
        </div>
      </div>
    </div>
  );
}

export default Team;