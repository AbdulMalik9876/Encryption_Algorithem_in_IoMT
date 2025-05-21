import Team from './Team';
import './styles/About.css';
import storyImage from './assets/our_story.jpeg';
import missionImage from './assets/mission-image.jpg';
import security_first from './assets/security-first.png';
import continuous_innovation from './assets/continue-inovation.png';
import global_impact from './assets/global-impact.png';

function About() {
  return (
    <section className="about-section">
      <div className="about-container">
        <h2 className="about-title">About Our Company</h2>
        <p className="about-subtitle">Pioneering secure IoMT Encryption solutions since 2025</p>
        <div className="about-story">
          <h3 className="about-heading">Our Story</h3>
          <div className="about-story-content">
            <div className="about-text-column">
              <p className="about-text">
                Founded in 2025 by a team of cybersecurity and embedded systems experts, we set out to solve the growing security challenges in the IoMT space.
              </p>
              <p className="about-text">
                Recognizing the vulnerabilities in existing IoT devices, we developed our proprietary security framework that combines hardware-based encryption with over-the-air secure updates.
              </p>
              <p className="about-text">
                Today, our solutions protect critical infrastructure for Fortune 500 companies, government agencies, and innovative startups around the world.
              </p>
            </div>
            <div className="about-image-column">
              <img src={storyImage} alt="Our Story" className="about-story-image" />
            </div>
          </div>
        </div>
        <div className="about-mission">
          <h3 className="about-heading">Our Mission</h3>
          <div className="about-mission-content">
            <div className="about-image-column">
              <img src={missionImage} alt="Our Mission" className="about-mission-image" />
            </div>
            <div className="about-text-column">
              <p className="about-text">
                We believe in a future where connected devices enhance our lives without compromising our security and privacy.
              </p>
              <ul className="about-list">
                <li className="about-list-item">
                  <img src={security_first} alt="Security First" className="about-icon" />
                  <div className="about-list-item-content">
                    <strong className="about-list-heading">Security First</strong>
                    <p className="about-list-text">
                      Building security into every layer of our technology stack
                    </p>
                  </div>
                </li>
                <li className="about-list-item">
                  <img src={continuous_innovation} alt="Continuous Innovation" className="about-icon" />
                  <div className="about-list-item-content">
                    <strong className="about-list-heading">Continuous Innovation</strong>
                    <p className="about-list-text">
                      Pushing the boundaries of what's possible in edge computing
                    </p>
                  </div>
                </li>
                <li className="about-list-item">
                  <img src={global_impact} alt="Global Impact" className="about-icon" />
                  <div className="about-list-item-content">
                    <strong className="about-list-heading">Global Impact</strong>
                    <p className="about-list-text">
                      Making secure IoT accessible to organizations of all sizes
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Team />
        <div className="about-join">
          <h3 className="about-heading-team">Join Our Team</h3>
          <p className="about-text">
            We're always looking for talented engineers and security experts to join our mission.
          </p>
          <button className="about-button">View Open Positions</button>
        </div>
      </div>
    </section>
  );
}

export default About;