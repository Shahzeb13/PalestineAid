import { useAuth } from '../Context/AuthContext';
import Navbar from '../Components/navbar/navbar';
import Profile from '../Components/Profile';
import './Dashboard.css';

const ReceiverDashboard = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-content">
            <h1>Welcome, {user?.name}! 🤝</h1>
            <p>We're here to help you get the support you need</p>
          </div>
          <div className="welcome-illustration">
            <div className="support-icon">🤲</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <h3>Active Requests</h3>
              <p className="stat-value">3</p>
              <span className="stat-change">2 pending approval</span>
            </div>
          </div>
          
          <div className="stat-card success">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>Approved Requests</h3>
              <p className="stat-value">12</p>
              <span className="stat-change positive">+3 this month</span>
            </div>
          </div>
          
          <div className="stat-card info">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h3>Aid Received</h3>
              <p className="stat-value">$1,850</p>
              <span className="stat-change positive">+$450 this week</span>
            </div>
          </div>
          
          <div className="stat-card secondary">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <h3>Response Time</h3>
              <p className="stat-value">2.3 days</p>
              <span className="stat-change">Average</span>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="action-section">
          <h2>Quick Actions</h2>
          <div className="action-grid">
            <div className="action-card primary-action">
              <div className="action-icon">➕</div>
              <h3>Create New Request</h3>
              <p>Submit a new aid request for your needs</p>
              <button className="action-btn primary">Request Aid</button>
            </div>
            
            <div className="action-card">
              <div className="action-icon">📋</div>
              <h3>My Requests</h3>
              <p>View and manage your aid requests</p>
              <button className="action-btn secondary">View Requests</button>
            </div>
            
            <div className="action-card">
              <div className="action-icon">📊</div>
              <h3>Track Aid</h3>
              <p>Monitor the status of your received aid</p>
              <button className="action-btn secondary">Track Now</button>
            </div>
            
            <div className="action-card">
              <div className="action-icon">💬</div>
              <h3>Contact Support</h3>
              <p>Get help with your requests or questions</p>
              <button className="action-btn secondary">Contact</button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon success">✅</div>
              <div className="activity-content">
                <h4>Request Approved</h4>
                <p>Your medical supplies request has been approved and is being processed</p>
                <span className="activity-time">1 hour ago</span>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon info">📦</div>
              <div className="activity-content">
                <h4>Aid Delivered</h4>
                <p>Food supplies worth $200 have been delivered to your location</p>
                <span className="activity-time">1 day ago</span>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon warning">⏳</div>
              <div className="activity-content">
                <h4>Request Under Review</h4>
                <p>Your housing assistance request is currently being reviewed by our team</p>
                <span className="activity-time">2 days ago</span>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon info">📧</div>
              <div className="activity-content">
                <h4>Update Received</h4>
                <p>You received an update about your emergency fund request</p>
                <span className="activity-time">3 days ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Urgent Needs */}
        <div className="urgent-section">
          <h2>Urgent Needs</h2>
          <div className="urgent-grid">
            <div className="urgent-card">
              <div className="urgent-badge">Urgent</div>
              <h3>Medical Supplies</h3>
              <p>Need immediate medical assistance for family member</p>
              <div className="urgent-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '75%'}}></div>
                </div>
                <span>75% funded</span>
              </div>
              <button className="urgent-btn">Update Request</button>
            </div>
            
            <div className="urgent-card">
              <div className="urgent-badge">High Priority</div>
              <h3>Food Assistance</h3>
              <p>Weekly food supplies for family of 5</p>
              <div className="urgent-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '90%'}}></div>
                </div>
                <span>90% funded</span>
              </div>
              <button className="urgent-btn">View Details</button>
            </div>
          </div>
        </div>

        <Profile />
      </div>
    </>
  );
};

export default ReceiverDashboard; 