import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './EmergencyContact.css';

const EmergencyContact = () => {
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    urgency: 'high',
    description: '',
    contactPreference: 'phone'
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const emergencyCategories = [
    {
      id: 'general',
      name: 'General Emergency',
      description: 'Immediate humanitarian assistance needed',
      icon: '🚨',
      color: '#dc2626'
    },
    {
      id: 'medical',
      name: 'Medical Emergency',
      description: 'Urgent medical care or supplies needed',
      icon: '🏥',
      color: '#ea580c'
    },
    {
      id: 'food',
      name: 'Food Security',
      description: 'Critical food shortage or hunger crisis',
      icon: '🍞',
      color: '#d97706'
    },
    {
      id: 'shelter',
      name: 'Shelter & Safety',
      description: 'Emergency shelter or protection needed',
      icon: '🏠',
      color: '#059669'
    },
    {
      id: 'evacuation',
      name: 'Evacuation Support',
      description: 'Assistance with evacuation or relocation',
      icon: '🚑',
      color: '#dc2626'
    }
  ];

  const emergencyHotlines = [
    {
      name: 'Palestine Red Crescent',
      number: '+970 2 240 6515',
      description: 'Emergency medical services and humanitarian aid',
      icon: '🏥'
    },
    {
      name: 'UNRWA Emergency',
      number: '+970 2 589 0400',
      description: 'United Nations Relief and Works Agency',
      icon: '🇺🇳'
    },
    {
      name: 'Humanitarian Hotline',
      number: '+970 2 240 6515',
      description: 'General humanitarian assistance',
      icon: '🤝'
    },
    {
      name: 'Emergency Coordination',
      number: '+970 2 240 6515',
      description: 'Emergency response coordination',
      icon: '📞'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setShowSuccess(true);
      setLoading(false);
    }, 2000);
  };

  const getSelectedCategory = () => {
    return emergencyCategories.find(cat => cat.id === selectedCategory);
  };

  if (showSuccess) {
    return (
      <div className="emergency-contact-container">
        <div className="success-modal">
          <div className="success-content">
            <div className="success-icon">✅</div>
            <h2>Emergency Contact Submitted!</h2>
            <p>Your emergency request has been received and our team will contact you immediately.</p>
            
            <div className="contact-info">
              <h3>What happens next:</h3>
              <ul>
                <li>Our emergency response team will contact you within 15 minutes</li>
                <li>We'll assess your situation and provide immediate assistance</li>
                <li>You'll receive regular updates on the response progress</li>
              </ul>
            </div>

            <div className="urgent-note">
              <strong>🚨 If this is a life-threatening emergency, please call emergency services immediately.</strong>
            </div>

            <div className="success-actions">
              <Link to="/" className="home-btn">Return Home</Link>
              <button 
                className="new-request-btn"
                onClick={() => {
                  setShowSuccess(false);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    location: '',
                    urgency: 'high',
                    description: '',
                    contactPreference: 'phone'
                  });
                }}
              >
                New Emergency Request
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="emergency-contact-container">
      {/* Hero Section */}
      <div className="emergency-hero">
        <div className="hero-content">
          <div className="emergency-alert">
            <span className="alert-icon">🚨</span>
            <span className="alert-text">EMERGENCY CONTACT CENTER</span>
          </div>
          <h1>Emergency Contact</h1>
          <p>Get immediate assistance for urgent humanitarian needs</p>
        </div>
      </div>

      <div className="contact-content">
        {/* Emergency Hotlines */}
        <div className="hotlines-section">
          <h2>Emergency Hotlines</h2>
          <p className="section-description">Call these numbers immediately for urgent assistance</p>
          
          <div className="hotlines-grid">
            {emergencyHotlines.map((hotline, index) => (
              <div key={index} className="hotline-card">
                <div className="hotline-icon">{hotline.icon}</div>
                <div className="hotline-info">
                  <h3>{hotline.name}</h3>
                  <div className="hotline-number">
                    <a href={`tel:${hotline.number}`}>{hotline.number}</a>
                  </div>
                  <p>{hotline.description}</p>
                </div>
                <button 
                  className="call-btn"
                  onClick={() => window.open(`tel:${hotline.number}`)}
                >
                  📞 Call Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Request Form */}
        <div className="request-form-section">
          <h2>Submit Emergency Request</h2>
          <p className="section-description">Fill out this form for immediate assistance</p>

          <form onSubmit={handleSubmit} className="emergency-form">
            {/* Category Selection */}
            <div className="form-section">
              <h3>Emergency Category</h3>
              <div className="category-grid">
                {emergencyCategories.map(category => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
                    style={{ borderColor: category.color }}
                  >
                    <span className="category-icon">{category.icon}</span>
                    <h4>{category.name}</h4>
                    <p>{category.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="form-section">
              <h3>Contact Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location">Location *</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="City, region, or specific location"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Details */}
            <div className="form-section">
              <h3>Emergency Details</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="urgency">Urgency Level *</label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="High">🚨 High - Immediate response needed</option>
                    <option value="Medium">⚠️ Medium - Urgent assistance required</option>
                    <option value="Low">📋 Low - General assistance request</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="contactPreference">Preferred Contact Method</label>
                  <select
                    id="contactPreference"
                    name="contactPreference"
                    value={formData.contactPreference}
                    onChange={handleInputChange}
                  >
                    <option value="phone">📞 Phone Call</option>
                    <option value="sms">💬 SMS/Text Message</option>
                    <option value="email">📧 Email</option>
                    <option value="whatsapp">📱 WhatsApp</option>
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Emergency Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  placeholder="Please describe the emergency situation, number of people affected, and specific assistance needed..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Submitting Emergency Request...
                  </>
                ) : (
                  <>
                    🚨 Submit Emergency Request
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Additional Resources */}
        <div className="resources-section">
          <h2>Additional Resources</h2>
          <div className="resources-grid">
            <div className="resource-card">
              <h3>📋 Emergency Checklist</h3>
              <ul>
                <li>Ensure your safety first</li>
                <li>Contact local emergency services if needed</li>
                <li>Gather essential documents</li>
                <li>Prepare emergency supplies</li>
              </ul>
            </div>
            
            <div className="resource-card">
              <h3>📱 Mobile Apps</h3>
              <ul>
                <li>Emergency Alert Apps</li>
                <li>First Aid Guides</li>
                <li>Emergency Contact Lists</li>
                <li>Weather & Safety Updates</li>
              </ul>
            </div>
            
            <div className="resource-card">
              <h3>🌐 Online Resources</h3>
              <ul>
                <li>Emergency Preparedness Guides</li>
                <li>Local Emergency Information</li>
                <li>Community Support Networks</li>
                <li>Humanitarian Aid Updates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContact; 