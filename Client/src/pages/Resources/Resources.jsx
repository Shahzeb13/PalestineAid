import React, { useState } from 'react';
import './Resources.css';

const Resources = () => {
  const [activeTab, setActiveTab] = useState('guides');
  const [selectedResource, setSelectedResource] = useState(null);

  const resourceCategories = [
    { id: 'guides', name: 'How to Help', icon: '📖' },
    { id: 'education', name: 'Learn About Palestine', icon: '🎓' },
    { id: 'emergency', name: 'Emergency Resources', icon: '🚨' },
    { id: 'organizations', name: 'Partner Organizations', icon: '🤝' },
    { id: 'reports', name: 'Reports & Data', icon: '📊' }
  ];

  const resources = {
    guides: [
      {
        id: 1,
        title: "How to Donate Safely",
        description: "A comprehensive guide on how to donate safely and effectively to humanitarian causes in Palestine.",
        type: "PDF Guide",
        duration: "10 min read",
        tags: ["Donation", "Safety", "Beginner"],
        content: "Learn about verified donation channels, understanding where your money goes, and how to ensure your contribution makes the maximum impact."
      },
      {
        id: 2,
        title: "Volunteering Best Practices",
        description: "Essential guidelines for volunteering in humanitarian contexts and crisis zones.",
        type: "Interactive Guide",
        duration: "15 min read",
        tags: ["Volunteering", "Safety", "Training"],
        content: "Comprehensive guide covering safety protocols, cultural sensitivity, and effective ways to contribute your skills and time."
      },
      {
        id: 3,
        title: "Fundraising for Palestine Aid",
        description: "Step-by-step guide to organizing successful fundraising campaigns for humanitarian aid.",
        type: "Video Series",
        duration: "45 min total",
        tags: ["Fundraising", "Campaigns", "Community"],
        content: "Learn how to organize events, use social media effectively, and build sustainable fundraising initiatives."
      }
    ],
    education: [
      {
        id: 4,
        title: "Understanding the Humanitarian Crisis",
        description: "Educational content about the current humanitarian situation and its historical context.",
        type: "Interactive Course",
        duration: "2 hours",
        tags: ["History", "Crisis", "Education"],
        content: "Comprehensive overview of the humanitarian crisis, including historical context, current challenges, and international response."
      },
      {
        id: 5,
        title: "Palestinian Culture & Heritage",
        description: "Explore the rich cultural heritage and traditions of Palestine.",
        type: "Multimedia",
        duration: "1.5 hours",
        tags: ["Culture", "Heritage", "Education"],
        content: "Discover Palestinian art, music, literature, and traditions that have shaped the region's rich cultural landscape."
      },
      {
        id: 6,
        title: "Humanitarian Law & Rights",
        description: "Understanding international humanitarian law and human rights in conflict zones.",
        type: "Documentation",
        duration: "3 hours",
        tags: ["Law", "Rights", "International"],
        content: "Educational materials on international humanitarian law, human rights, and the legal framework for humanitarian assistance."
      }
    ],
    emergency: [
      {
        id: 7,
        title: "Emergency Contact Directory",
        description: "Comprehensive directory of emergency contacts and resources for crisis situations.",
        type: "Directory",
        duration: "Reference",
        tags: ["Emergency", "Contacts", "Crisis"],
        content: "Updated directory of emergency contacts, medical facilities, and crisis response organizations in the region."
      },
      {
        id: 8,
        title: "First Aid & Medical Resources",
        description: "Essential first aid guides and medical resource information for emergency situations.",
        type: "Guides",
        duration: "Reference",
        tags: ["Medical", "First Aid", "Emergency"],
        content: "Comprehensive first aid guides, medical resource lists, and emergency response protocols."
      },
      {
        id: 9,
        title: "Crisis Communication Protocols",
        description: "Guidelines for effective communication during humanitarian crises and emergencies.",
        type: "Protocols",
        duration: "30 min read",
        tags: ["Communication", "Crisis", "Protocols"],
        content: "Essential protocols for maintaining communication during emergencies and coordinating humanitarian response efforts."
      }
    ],
    organizations: [
      {
        id: 10,
        title: "UN Agencies & International NGOs",
        description: "Directory of major UN agencies and international NGOs working in the region.",
        type: "Directory",
        duration: "Reference",
        tags: ["UN", "NGOs", "International"],
        content: "Comprehensive list of UN agencies, international NGOs, and their specific areas of work and contact information."
      },
      {
        id: 11,
        title: "Local Palestinian Organizations",
        description: "Directory of local Palestinian organizations and community groups providing aid and support.",
        type: "Directory",
        duration: "Reference",
        tags: ["Local", "Community", "Organizations"],
        content: "Information about local Palestinian organizations, their missions, and how they're making a difference in their communities."
      },
      {
        id: 12,
        title: "Partnership Opportunities",
        description: "Information about partnership opportunities with humanitarian organizations.",
        type: "Guide",
        duration: "20 min read",
        tags: ["Partnerships", "Collaboration", "Networking"],
        content: "Guide to establishing partnerships, collaboration opportunities, and networking within the humanitarian sector."
      }
    ],
    reports: [
      {
        id: 13,
        title: "Humanitarian Needs Assessment",
        description: "Latest assessment of humanitarian needs and priorities in the region.",
        type: "Report",
        duration: "45 min read",
        tags: ["Assessment", "Needs", "Data"],
        content: "Comprehensive assessment of current humanitarian needs, priorities, and recommendations for response efforts."
      },
      {
        id: 14,
        title: "Impact Evaluation Reports",
        description: "Evaluation reports on the impact of humanitarian assistance programs.",
        type: "Reports",
        duration: "60 min read",
        tags: ["Impact", "Evaluation", "Results"],
        content: "Detailed evaluation reports showing the impact of humanitarian programs and lessons learned for future initiatives."
      },
      {
        id: 15,
        title: "Statistical Data & Analytics",
        description: "Statistical data and analytics on humanitarian assistance and crisis response.",
        type: "Data",
        duration: "Reference",
        tags: ["Statistics", "Analytics", "Data"],
        content: "Comprehensive statistical data, analytics, and visualizations related to humanitarian assistance and crisis response."
      }
    ]
  };

  const quickActions = [
    {
      title: "Donate Now",
      description: "Make an immediate impact with your donation",
      icon: "💝",
      action: "Donate",
      color: "#dc2626"
    },
    {
      title: "Volunteer",
      description: "Join our volunteer program",
      icon: "🤝",
      action: "Apply",
      color: "#ea580c"
    },
    {
      title: "Spread Awareness",
      description: "Share information and raise awareness",
      icon: "📢",
      action: "Share",
      color: "#d97706"
    },
    {
      title: "Contact Us",
      description: "Get in touch for more information",
      icon: "📞",
      action: "Contact",
      color: "#059669"
    }
  ];

  return (
    <div className="resources-container">
      {/* Hero Section */}
      <div className="resources-hero">
        <div className="hero-content">
          <h1>Resources & Education</h1>
          <p>Comprehensive resources to help you understand, support, and make a difference</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <div className="actions-grid">
          {quickActions.map((action, index) => (
            <div key={index} className="action-card" style={{ borderColor: action.color }}>
              <div className="action-icon" style={{ color: action.color }}>
                {action.icon}
              </div>
              <h3>{action.title}</h3>
              <p>{action.description}</p>
              <button 
                className="action-btn"
                style={{ backgroundColor: action.color }}
              >
                {action.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Resource Categories */}
      <div className="resource-categories">
        <div className="category-tabs">
          {resourceCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`category-tab ${activeTab === category.id ? 'active' : ''}`}
            >
              <span className="tab-icon">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="resources-grid">
          {resources[activeTab].map(resource => (
            <div key={resource.id} className="resource-card">
              <div className="resource-header">
                <h3>{resource.title}</h3>
                <span className="resource-type">{resource.type}</span>
              </div>
              
              <p className="resource-description">{resource.description}</p>
              
              <div className="resource-meta">
                <span className="duration">⏱️ {resource.duration}</span>
              </div>
              
              <div className="resource-tags">
                {resource.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
              
              <div className="resource-content">
                <p>{resource.content}</p>
              </div>
              
              <div className="resource-actions">
                <button 
                  className="view-btn"
                  onClick={() => setSelectedResource(resource)}
                >
                  View Details
                </button>
                <button className="download-btn">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resource Detail Modal */}
      {selectedResource && (
        <div className="modal-overlay" onClick={() => setSelectedResource(null)}>
          <div className="resource-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedResource.title}</h2>
              <button 
                className="close-btn"
                onClick={() => setSelectedResource(null)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="resource-info">
                <div className="info-item">
                  <strong>Type:</strong> {selectedResource.type}
                </div>
                <div className="info-item">
                  <strong>Duration:</strong> {selectedResource.duration}
                </div>
                <div className="info-item">
                  <strong>Tags:</strong>
                  <div className="modal-tags">
                    {selectedResource.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="resource-full-content">
                <h3>Description</h3>
                <p>{selectedResource.description}</p>
                
                <h3>Content Overview</h3>
                <p>{selectedResource.content}</p>
              </div>
              
              <div className="modal-actions">
                <button className="primary-btn">Access Resource</button>
                <button className="secondary-btn">Download PDF</button>
                <button className="secondary-btn">Share</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Resources Section */}
      <div className="additional-resources">
        <h2>Additional Resources</h2>
        <div className="additional-grid">
          <div className="additional-card">
            <h3>📚 Learning Hub</h3>
            <p>Access our comprehensive learning materials and courses</p>
            <button className="learn-btn">Explore Courses</button>
          </div>
          
          <div className="additional-card">
            <h3>📰 News & Updates</h3>
            <p>Stay informed with the latest news and updates</p>
            <button className="learn-btn">Read News</button>
          </div>
          
          <div className="additional-card">
            <h3>🎥 Video Library</h3>
            <p>Watch educational videos and documentaries</p>
            <button className="learn-btn">Watch Videos</button>
          </div>
          
          <div className="additional-card">
            <h3>📞 Support Center</h3>
            <p>Get help and support from our team</p>
            <button className="learn-btn">Get Support</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources; 