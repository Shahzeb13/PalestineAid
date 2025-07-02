import React, { useState } from 'react';
import './Volunteer.css';

const Volunteer = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showApplication, setShowApplication] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    availability: '',
    motivation: ''
  });

  const volunteerCategories = [
    { id: 'all', name: 'All Opportunities', icon: '🌟' },
    { id: 'medical', name: 'Medical Support', icon: '🏥' },
    { id: 'education', name: 'Education', icon: '📚' },
    { id: 'logistics', name: 'Logistics & Distribution', icon: '📦' },
    { id: 'community', name: 'Community Outreach', icon: '🤝' },
    { id: 'technical', name: 'Technical Support', icon: '💻' }
  ];

  const volunteerOpportunities = [
    {
      id: 1,
      title: "Medical Volunteer",
      category: "medical",
      location: "Gaza City",
      duration: "3-6 months",
      commitment: "Full-time",
      description: "Provide medical assistance in emergency clinics and mobile health units. Support healthcare professionals in treating patients and distributing medical supplies.",
      requirements: [
        "Medical degree or nursing qualification",
        "Experience in emergency medicine preferred",
        "Ability to work in challenging conditions",
        "Fluent in Arabic and English"
      ],
      benefits: [
        "Accommodation provided",
        "Transportation covered",
        "Professional development",
        "Cultural immersion"
      ],
      urgency: "High",
      spots: 5
    },
    {
      id: 2,
      title: "Education Coordinator",
      category: "education",
      location: "West Bank",
      duration: "6-12 months",
      commitment: "Part-time",
      description: "Coordinate educational programs for children and adults. Develop curriculum, organize classes, and support teachers in refugee camps and community centers.",
      requirements: [
        "Education degree or teaching experience",
        "Experience with curriculum development",
        "Patience and creativity",
        "Basic Arabic helpful"
      ],
      benefits: [
        "Flexible schedule",
        "Teaching experience",
        "Community impact",
        "Professional networking"
      ],
      urgency: "Medium",
      spots: 8
    },
    {
      id: 3,
      title: "Logistics Coordinator",
      category: "logistics",
      location: "Multiple Locations",
      duration: "2-4 months",
      commitment: "Full-time",
      description: "Coordinate the distribution of aid supplies, manage inventory, and ensure efficient delivery of humanitarian assistance to communities in need.",
      requirements: [
        "Logistics or supply chain experience",
        "Strong organizational skills",
        "Problem-solving ability",
        "Physical fitness"
      ],
      benefits: [
        "Comprehensive training",
        "Leadership experience",
        "Travel opportunities",
        "Competitive stipend"
      ],
      urgency: "Critical",
      spots: 3
    },
    {
      id: 4,
      title: "Community Outreach Worker",
      category: "community",
      location: "Jerusalem",
      duration: "4-8 months",
      commitment: "Part-time",
      description: "Engage with local communities, assess needs, and connect families with available resources and support services.",
      requirements: [
        "Social work or community development background",
        "Strong communication skills",
        "Cultural sensitivity",
        "Fluent in Arabic"
      ],
      benefits: [
        "Community building experience",
        "Cultural exchange",
        "Flexible hours",
        "Personal growth"
      ],
      urgency: "Medium",
      spots: 6
    },
    {
      id: 5,
      title: "IT Support Specialist",
      category: "technical",
      location: "Remote/On-site",
      duration: "3-6 months",
      commitment: "Flexible",
      description: "Provide technical support for our digital platforms, help maintain communication systems, and support data management for aid distribution.",
      requirements: [
        "IT or computer science background",
        "Experience with databases",
        "Problem-solving skills",
        "Remote work capability"
      ],
      benefits: [
        "Remote work options",
        "Technical experience",
        "Flexible schedule",
        "Professional development"
      ],
      urgency: "Low",
      spots: 4
    },
    {
      id: 6,
      title: "Emergency Response Team",
      category: "medical",
      location: "Gaza Strip",
      duration: "1-3 months",
      commitment: "Full-time",
      description: "Join our emergency response team providing immediate medical assistance, first aid, and crisis support during emergencies.",
      requirements: [
        "Emergency medical training",
        "Physical fitness",
        "Stress management skills",
        "Team player"
      ],
      benefits: [
        "Emergency response training",
        "Crisis management experience",
        "Team building",
        "Life-saving skills"
      ],
      urgency: "Critical",
      spots: 2
    }
  ];

  const filteredOpportunities = selectedCategory === 'all' 
    ? volunteerOpportunities 
    : volunteerOpportunities.filter(opp => opp.category === selectedCategory);

  const handleApplicationSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the application to your backend
    alert('Thank you for your application! We will contact you within 48 hours.');
    setShowApplication(false);
    setApplicationForm({
      name: '',
      email: '',
      phone: '',
      experience: '',
      availability: '',
      motivation: ''
    });
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Critical': return '#dc2626';
      case 'High': return '#ea580c';
      case 'Medium': return '#d97706';
      default: return '#059669';
    }
  };

  return (
    <div className="volunteer-container">
      {/* Hero Section */}
      <div className="volunteer-hero">
        <div className="hero-content">
          <h1>Volunteer with PalestineAid</h1>
          <p>Join our mission to provide humanitarian assistance and support to communities in need</p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Volunteers</span>
            </div>
            <div className="stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">Projects</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        <h2>Find Your Opportunity</h2>
        <div className="category-buttons">
          {volunteerCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            >
              <span className="category-icon">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="opportunities-grid">
        {filteredOpportunities.map(opportunity => (
          <div key={opportunity.id} className="opportunity-card">
            <div className="opportunity-header">
              <h3>{opportunity.title}</h3>
              <span 
                className="urgency-badge"
                style={{ backgroundColor: getUrgencyColor(opportunity.urgency) }}
              >
                {opportunity.urgency}
              </span>
            </div>
            
            <div className="opportunity-details">
              <div className="detail-item">
                <span className="detail-icon">📍</span>
                <span>{opportunity.location}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">⏱️</span>
                <span>{opportunity.duration}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">📅</span>
                <span>{opportunity.commitment}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">👥</span>
                <span>{opportunity.spots} spots available</span>
              </div>
            </div>

            <p className="opportunity-description">{opportunity.description}</p>

            <div className="opportunity-requirements">
              <h4>Requirements:</h4>
              <ul>
                {opportunity.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="opportunity-benefits">
              <h4>Benefits:</h4>
              <ul>
                {opportunity.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>

            <button
              className="apply-btn"
              onClick={() => {
                setSelectedOpportunity(opportunity);
                setShowApplication(true);
              }}
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>

      {/* Application Modal */}
      {showApplication && (
        <div className="modal-overlay">
          <div className="application-modal">
            <div className="modal-header">
              <h2>Apply for: {selectedOpportunity?.title}</h2>
              <button 
                className="close-btn"
                onClick={() => setShowApplication(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleApplicationSubmit} className="application-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  value={applicationForm.name}
                  onChange={(e) => setApplicationForm({...applicationForm, name: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  required
                  value={applicationForm.email}
                  onChange={(e) => setApplicationForm({...applicationForm, email: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={applicationForm.phone}
                  onChange={(e) => setApplicationForm({...applicationForm, phone: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Relevant Experience *</label>
                <textarea
                  required
                  rows="4"
                  value={applicationForm.experience}
                  onChange={(e) => setApplicationForm({...applicationForm, experience: e.target.value})}
                  placeholder="Describe your relevant experience and skills..."
                />
              </div>

              <div className="form-group">
                <label>Availability *</label>
                <textarea
                  required
                  rows="3"
                  value={applicationForm.availability}
                  onChange={(e) => setApplicationForm({...applicationForm, availability: e.target.value})}
                  placeholder="When are you available to start and for how long?"
                />
              </div>

              <div className="form-group">
                <label>Motivation *</label>
                <textarea
                  required
                  rows="4"
                  value={applicationForm.motivation}
                  onChange={(e) => setApplicationForm({...applicationForm, motivation: e.target.value})}
                  placeholder="Why do you want to volunteer with PalestineAid?"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowApplication(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Volunteer; 