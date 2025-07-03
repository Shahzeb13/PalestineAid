import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import NewsWidget from '../../Components/NewsWidget';
import DonationWidget from '../../Components/DonationWidget';
import EmergencyResponseWidget from '../../Components/EmergencyResponseWidget';
import ImpactStoriesWidget from '../../Components/ImpactStoriesWidget';

const LandingPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="landing-container">
      {/* Animated Background Elements */}
      <div className="floating-elements">
        <div className="floating-element" style={{ animationDelay: '0s' }}>🇵🇸</div>
        <div className="floating-element" style={{ animationDelay: '2s' }}>🕊️</div>
        <div className="floating-element" style={{ animationDelay: '4s' }}>❤️</div>
        <div className="floating-element" style={{ animationDelay: '6s' }}>🤝</div>
        <div className="floating-element" style={{ animationDelay: '8s' }}>🌍</div>
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-card">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '18px' }}>
            <img
              src="https://img.freepik.com/premium-vector/palestine-support-logo-icon-design-vector-illustration_757387-5020.jpg"
              alt="Palestine Aid Logo"
              className="hero-logo"
              style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
            />
          </div>
          <div className="hero-text">
            <div className="hero-tagline" style={{ color: '#009736' }}>United for Humanity & Hope</div>
            <h1 className="hero-title">
            <span style={{ color: '#000', fontWeight: 'bold' }}>Nusrah</span>
              <span className="title-line" style={{ color: '#009736', fontWeight: 'bold' }}>Pal</span>
              <span className="title-line" style={{ color: '#000', fontWeight: 'bold' }}>est</span>
              <span className="title-accent" style={{ color: '#ce1126', fontWeight: 'bold' }}>ine</span>
             
            </h1>
            <p className="hero-subtitle">
              Supporting humanitarian efforts and providing aid to those in need
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">1000+</span>
                <span className="stat-label">People Helped</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Active Projects</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Support</span>
              </div>
            </div>
          </div>
          <div className="hero-actions">
            <Link to="/register" className="cta-button primary">
              <span>Get Started</span>
              <span className="button-icon">🚀</span>
            </Link>
            <Link to="/login" className="cta-button secondary">
              <span>Sign In</span>
              <span className="button-icon">🔐</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Emergency Response Widget */}
      <div className="section-spacing">
        <EmergencyResponseWidget />
      </div>

      {/* Track Donation Section */}
      <div className="track-section" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '40px 0'}}>
        <Link to="/tracking" className="cta-button primary large" style={{background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', color: '#fff', fontWeight: 700, fontSize: 20, borderRadius: 12, padding: '18px 36px', boxShadow: '0 4px 16px rgba(99,102,241,0.12)', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 12}}>
          <span>🔎 Track Your Donation</span>
        </Link>
      </div>

      {/* Impact Stories Widget */}
      <div className="section-spacing">
        <ImpactStoriesWidget />
      </div>

      {/* News Section (Custom Heading and Description) */}
      <div className="custom-news-section" style={{
        width: '100%',
        maxWidth: 1400,
        margin: '0 auto 32px auto',
        padding: '32px 0 8px 0',
        textAlign: 'center',
        background: 'linear-gradient(90deg, #18181b 60%, #232526 100%)',
        borderRadius: 24,
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
        color: '#fff',
        position: 'relative',
      }}>
        <h2 style={{
          color: '#ce1126',
          fontWeight: 900,
          fontSize: 38,
          margin: 0,
          letterSpacing: 1,
          textAlign: 'center',
          textShadow: '0 2px 8px rgba(0,0,0,0.18)'
        }}>Gaza News & Current Affairs</h2>
        <p style={{
          fontSize: 20,
          margin: '18px auto 0 auto',
          maxWidth: 900,
          color: '#f3f4f6',
          fontWeight: 400,
          lineHeight: 1.5,
          textAlign: 'center',
          textShadow: '0 1px 4px rgba(0,0,0,0.10)'
        }}>
          Stay informed. Stay inspired. Make a difference.<br/>
          <span style={{fontWeight:600, color:'#fff'}}>Get the latest updates, stories, and urgent calls for support from Gaza. Your awareness and action can help save lives and bring hope to those in need.</span>
        </p>
      </div>
      {/* News Widget Section */}
      <NewsWidget />

      {/* Donation Widget Section */}
      <DonationWidget />

      {/* Live Clock */}
      <div className="live-clock">
        <div className="clock-content">
          <div className="time">{currentTime.toLocaleTimeString()}</div>
          <div className="date">{currentTime.toLocaleDateString()}</div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="mission-section">
        <h2 className="mission-title">Our Mission</h2>
        <div className="mission-content mission-flex">
          <div className="mission-row">
            <div className="mission-features-col">
              <div className="feature">
                <span className="feature-icon">⚡</span>
                <span>Quick Response</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🔒</span>
                <span>Secure Platform</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🌱</span>
                <span>Sustainable Impact</span>
              </div>
            </div>
            <div className="mission-paragraph-col">
              <p>
                To provide immediate humanitarian assistance and support to communities in need, 
                ensuring that aid reaches those who need it most through transparent and efficient processes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <div className="cta-content">
          <h2>Ready to Make a Difference?</h2>
          <p>Join thousands of people helping communities in need</p>
          <div className="cta-buttons">
            <Link to="/register" className="cta-button primary large">
              Start Helping Today
            </Link>
            <Link to="/about" className="cta-button secondary large">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 