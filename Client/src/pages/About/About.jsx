import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-hero">
        <div className="hero-content">
          <h1>About Palestine Aid</h1>
          <p className="hero-subtitle">Connecting hearts, bridging hope, and delivering aid to those in need</p>
        </div>
      </div>

      <div className="about-content">
        {/* Mission Section */}
        <section className="about-section mission-section">
          <div className="section-header">
            <h2>🎯 Our Mission</h2>
            <p>Empowering communities through technology-driven humanitarian aid</p>
          </div>
          <div className="mission-content">
            <div className="mission-card">
              <div className="mission-icon">🤝</div>
              <h3>Connect</h3>
              <p>Bridge the gap between donors and recipients through our secure platform</p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">🚚</div>
              <h3>Deliver</h3>
              <p>Ensure timely and efficient delivery of aid to those who need it most</p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">💙</div>
              <h3>Support</h3>
              <p>Provide ongoing support and transparency throughout the aid process</p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="about-section how-it-works">
          <div className="section-header">
            <h2>⚙️ How It Works</h2>
            <p>Simple, secure, and transparent aid distribution</p>
          </div>
          <div className="workflow">
            <div className="workflow-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Request Aid</h3>
                <p>Recipients create detailed aid requests specifying their needs and location</p>
              </div>
            </div>
            <div className="workflow-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Review & Approve</h3>
                <p>Our team reviews requests and approves legitimate aid needs</p>
              </div>
            </div>
            <div className="workflow-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Match & Fund</h3>
                <p>Donors can view approved requests and contribute to specific causes</p>
              </div>
            </div>
            <div className="workflow-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Deliver & Track</h3>
                <p>We coordinate delivery and provide real-time tracking updates</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="about-section values-section">
          <div className="section-header">
            <h2>💎 Our Values</h2>
            <p>The principles that guide everything we do</p>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🔒</div>
              <h3>Transparency</h3>
              <p>Complete visibility into how aid is distributed and used</p>
            </div>
            <div className="value-card">
              <div className="value-icon">⚡</div>
              <h3>Efficiency</h3>
              <p>Streamlined processes to get aid to recipients quickly</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤲</div>
              <h3>Dignity</h3>
              <p>Treating every individual with respect and compassion</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌍</div>
              <h3>Impact</h3>
              <p>Measurable positive change in communities we serve</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🛡️</div>
              <h3>Security</h3>
              <p>Protecting donor information and ensuring safe transactions</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Partnership</h3>
              <p>Collaborating with local organizations and communities</p>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="about-section impact-section">
          <div className="section-header">
            <h2>📊 Our Impact</h2>
            <p>Making a difference, one request at a time</p>
          </div>
          <div className="impact-stats">
            <div className="stat-card">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Aid Requests</div>
              <div className="stat-description">Successfully processed and fulfilled</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50+</div>
              <div className="stat-label">Communities</div>
              <div className="stat-description">Served across Palestine</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">95%</div>
              <div className="stat-label">Success Rate</div>
              <div className="stat-description">Of aid requests fulfilled</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24h</div>
              <div className="stat-label">Average Response</div>
              <div className="stat-description">Time for urgent requests</div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="about-section team-section">
          <div className="section-header">
            <h2>👥 Our Team</h2>
            <p>Dedicated professionals committed to humanitarian aid</p>
          </div>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">👨‍💼</div>
              <h3>Ahmed Hassan</h3>
              <p className="member-role">Executive Director</p>
              <p className="member-bio">Leading our mission with 15+ years of humanitarian experience</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">👩‍💻</div>
              <h3>Sarah Al-Zahra</h3>
              <p className="member-role">Technology Director</p>
              <p className="member-bio">Ensuring our platform serves communities effectively</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">👨‍⚕️</div>
              <h3>Dr. Omar Khalil</h3>
              <p className="member-role">Medical Coordinator</p>
              <p className="member-bio">Overseeing medical aid distribution and health programs</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">👩‍🌾</div>
              <h3>Fatima Mansour</h3>
              <p className="member-role">Community Liaison</p>
              <p className="member-bio">Building relationships with local communities</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="about-section cta-section">
          <div className="cta-content">
            <h2>Ready to Make a Difference?</h2>
            <p>Join us in our mission to provide aid and support to communities in need</p>
            <div className="cta-buttons">
              <button className="cta-button primary">Start Donating</button>
              <button className="cta-button secondary">Request Aid</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About; 