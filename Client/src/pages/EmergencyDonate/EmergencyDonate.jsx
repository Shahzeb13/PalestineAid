import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './EmergencyDonate.css';

const EmergencyDonate = () => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState('general');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const emergencyTiers = [
    {
      amount: 25,
      title: "Emergency Food Pack",
      description: "Provides food for a family for 1 week",
      impact: "Feeds 1 family for 7 days",
      icon: "🍞",
      color: "#dc2626"
    },
    {
      amount: 50,
      title: "Medical Emergency Kit",
      description: "Essential medical supplies for emergency care",
      impact: "Treats 5 emergency cases",
      icon: "🏥",
      color: "#ea580c"
    },
    {
      amount: 100,
      title: "Shelter & Safety",
      description: "Emergency shelter and basic necessities",
      impact: "Provides shelter for 1 family",
      icon: "🏠",
      color: "#d97706"
    },
    {
      amount: 250,
      title: "Critical Care Package",
      description: "Comprehensive emergency response package",
      impact: "Supports 3 families in crisis",
      icon: "🚨",
      color: "#dc2626"
    }
  ];

  const donationTypes = [
    {
      id: 'general',
      name: 'General Emergency Fund',
      description: 'Immediate response to urgent humanitarian needs',
      icon: '🚨'
    },
    {
      id: 'medical',
      name: 'Medical Emergency Fund',
      description: 'Critical medical supplies and emergency care',
      icon: '🏥'
    },
    {
      id: 'food',
      name: 'Food Security Fund',
      description: 'Emergency food supplies and nutrition support',
      icon: '🍞'
    },
    {
      id: 'shelter',
      name: 'Shelter & Protection Fund',
      description: 'Emergency shelter and protection services',
      icon: '🏠'
    }
  ];

  const handleDonation = async () => {
    const amount = selectedAmount || parseFloat(customAmount);
    if (!amount || amount <= 0) {
      alert('Please select or enter a valid amount');
      return;
    }

    setLoading(true);
    
    // Simulate donation process
    setTimeout(() => {
      setShowSuccess(true);
      setLoading(false);
    }, 2000);
  };

  const getSelectedTier = () => {
    return emergencyTiers.find(tier => tier.amount === selectedAmount);
  };

  if (showSuccess) {
    return (
      <div className="emergency-donate-container">
        <div className="success-modal">
          <div className="success-content">
            <div className="success-icon">✅</div>
            <h2>Emergency Donation Successful!</h2>
            <p>Your donation of ${selectedAmount || customAmount} has been processed and will be used immediately for emergency humanitarian aid.</p>
            
            <div className="impact-summary">
              <h3>Your Impact:</h3>
              {getSelectedTier() && (
                <div className="impact-item">
                  <span className="impact-icon">{getSelectedTier().icon}</span>
                  <span>{getSelectedTier().impact}</span>
                </div>
              )}
            </div>

            <div className="success-actions">
              <Link to="/" className="home-btn">Return Home</Link>
              <button 
                className="donate-again-btn"
                onClick={() => {
                  setShowSuccess(false);
                  setSelectedAmount(null);
                  setCustomAmount('');
                }}
              >
                Donate Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="emergency-donate-container">
      {/* Hero Section */}
      <div className="emergency-hero">
        <div className="hero-content">
          <div className="emergency-alert">
            <span className="alert-icon">🚨</span>
            <span className="alert-text">EMERGENCY RESPONSE ACTIVE</span>
          </div>
          <h1>Emergency Donation</h1>
          <p>Your donation will provide immediate humanitarian assistance to families in crisis</p>
        </div>
      </div>

      <div className="donation-content">
        {/* Donation Type Selection */}
        <div className="donation-types">
          <h2>Choose Your Emergency Fund</h2>
          <div className="type-grid">
            {donationTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setDonationType(type.id)}
                className={`type-card ${donationType === type.id ? 'active' : ''}`}
              >
                <span className="type-icon">{type.icon}</span>
                <h3>{type.name}</h3>
                <p>{type.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Amount Selection */}
        <div className="amount-selection">
          <h2>Select Donation Amount</h2>
          <div className="tier-grid">
            {emergencyTiers.map(tier => (
              <button
                key={tier.amount}
                onClick={() => setSelectedAmount(tier.amount)}
                className={`tier-card ${selectedAmount === tier.amount ? 'active' : ''}`}
                style={{ borderColor: tier.color }}
              >
                <div className="tier-header">
                  <span className="tier-icon">{tier.icon}</span>
                  <span className="tier-amount">${tier.amount}</span>
                </div>
                <h3>{tier.title}</h3>
                <p>{tier.description}</p>
                <div className="tier-impact">{tier.impact}</div>
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="custom-amount">
            <h3>Or Enter Custom Amount</h3>
            <div className="amount-input">
              <span className="currency">$</span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                placeholder="Enter amount"
                min="1"
                step="1"
              />
            </div>
          </div>
        </div>

        {/* Impact Summary */}
        {selectedAmount && (
          <div className="impact-summary">
            <h2>Your Impact</h2>
            <div className="impact-card">
              <div className="impact-icon">{getSelectedTier().icon}</div>
              <div className="impact-details">
                <h3>{getSelectedTier().title}</h3>
                <p>{getSelectedTier().impact}</p>
                <div className="impact-amount">${selectedAmount}</div>
              </div>
            </div>
          </div>
        )}

        {/* Donation Button */}
        <div className="donation-action">
          <button
            className="emergency-donate-btn"
            onClick={handleDonation}
            disabled={loading || (!selectedAmount && !customAmount)}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Processing Donation...
              </>
            ) : (
              <>
                🚨 Donate ${selectedAmount || customAmount || '0'} Now
              </>
            )}
          </button>
          <p className="donation-note">
            Your donation will be processed immediately and used for emergency humanitarian assistance
          </p>
        </div>

        {/* Additional Information */}
        <div className="additional-info">
          <div className="info-grid">
            <div className="info-card">
              <h3>⚡ Immediate Impact</h3>
              <p>Your donation is processed instantly and deployed within 24 hours</p>
            </div>
            <div className="info-card">
              <h3>🔒 Secure & Transparent</h3>
              <p>All donations are secure and you'll receive updates on how your funds are used</p>
            </div>
            <div className="info-card">
              <h3>📊 100% Accountability</h3>
              <p>We provide detailed reports on how every dollar is spent</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyDonate; 