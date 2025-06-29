import { useAuth } from '../Context/AuthContext';
import Navbar from '../Components/navbar/navbar';
import Profile from '../Components/Profile';
import './Dashboard.css';

const DonaterDashboard = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-content">
            <h1>Welcome back, {user?.name}! 👋</h1>
            <p>Make a difference today with your generous donations</p>
          </div>
          <div className="welcome-illustration">
            <div className="donation-icon">💝</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Total Donated</h3>
              <p className="stat-value">$2,450</p>
              <span className="stat-change positive">+12% this month</span>
            </div>
          </div>
          
          <div className="stat-card secondary">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h3>Active Donations</h3>
              <p className="stat-value">8</p>
              <span className="stat-change">3 pending</span>
            </div>
          </div>
          
          <div className="stat-card success">
            <div className="stat-icon">❤️</div>
            <div className="stat-content">
              <h3>Lives Impacted</h3>
              <p className="stat-value">24</p>
              <span className="stat-change positive">+5 this week</span>
            </div>
          </div>
          
          <div className="stat-card info">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <h3>Donor Level</h3>
              <p className="stat-value">Gold</p>
              <span className="stat-change">Top 10%</span>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="action-section">
          <h2>Quick Actions</h2>
          <div className="action-grid">
            <div className="action-card primary-action">
              <div className="action-icon">➕</div>
              <h3>Make New Donation</h3>
              <p>Support urgent causes and help those in need</p>
              <button className="action-btn primary">Donate Now</button>
            </div>
            
            <div className="action-card">
              <div className="action-icon">📊</div>
              <h3>View My Donations</h3>
              <p>Track your donation history and impact</p>
              <button className="action-btn secondary">View History</button>
            </div>
            
            <div className="action-card">
              <div className="action-icon">🎁</div>
              <h3>Recurring Donations</h3>
              <p>Set up automatic monthly donations</p>
              <button className="action-btn secondary">Setup</button>
            </div>
            
            <div className="action-card">
              <div className="action-icon">📈</div>
              <h3>Impact Report</h3>
              <p>See how your donations are making a difference</p>
              <button className="action-btn secondary">View Report</button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon success">✓</div>
              <div className="activity-content">
                <h4>Donation Completed</h4>
                <p>Your $100 donation to "Emergency Relief Fund" has been delivered</p>
                <span className="activity-time">2 hours ago</span>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon info">📧</div>
              <div className="activity-content">
                <h4>Thank You Received</h4>
                <p>You received a thank you message from a family you helped</p>
                <span className="activity-time">1 day ago</span>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon warning">⏳</div>
              <div className="activity-content">
                <h4>Donation in Progress</h4>
                <p>Your $50 donation to "Medical Supplies" is being processed</p>
                <span className="activity-time">3 days ago</span>
              </div>
            </div>
          </div>
        </div>

        <Profile />
      </div>
    </>
  );
};

export default DonaterDashboard; 