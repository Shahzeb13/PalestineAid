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
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-line">Palestine</span>
              <span className="title-accent">Aid</span>
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
      <EmergencyResponseWidget />

      {/* Track Donation Section */}
      <div className="track-section" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '40px 0'}}>
        <Link to="/tracking" className="cta-button primary large" style={{background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', color: '#fff', fontWeight: 700, fontSize: 20, borderRadius: 12, padding: '18px 36px', boxShadow: '0 4px 16px rgba(99,102,241,0.12)', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 12}}>
          <span>🔎 Track Your Donation</span>
        </Link>
      </div>

      {/* Impact Stories Widget */}
      <ImpactStoriesWidget />

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
        <div className="mission-content">
          <h2>Our Mission</h2>
          <p>
            To provide immediate humanitarian assistance and support to communities in need, 
            ensuring that aid reaches those who need it most through transparent and efficient processes.
          </p>
          <div className="mission-features">
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