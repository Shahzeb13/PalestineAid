import { useAuth } from '../Context/AuthContext';
import Navbar from '../Components/navbar/navbar';
import Profile from '../Components/Profile';
import AdminCreateForm from '../Components/AdminCreateForm';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user?.name}! Manage your platform efficiently.</p>
          </div>
          <div className="admin-badge">
            <span className="badge-icon">👑</span>
            <span className="badge-text">
              {user?.isSuperAdmin ? 'Super Admin' : 'Admin'}
            </span>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="stats-section">
            <h2>Platform Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card primary">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <h3>Total Users</h3>
                  <p className="stat-number">1,247</p>
                  <p className="stat-change positive">+12% this week</p>
                </div>
              </div>
              
              <div className="stat-card success">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <h3>Total Donations</h3>
                  <p className="stat-number">$45,230</p>
                  <p className="stat-change positive">+8% this month</p>
                </div>
              </div>
              
              <div className="stat-card warning">
                <div className="stat-icon">📦</div>
                <div className="stat-content">
                  <h3>Aid Requests</h3>
                  <p className="stat-number">89</p>
                  <p className="stat-change neutral">5 pending</p>
                </div>
              </div>
              
              <div className="stat-card info">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <h3>Success Rate</h3>
                  <p className="stat-number">94%</p>
                  <p className="stat-change positive">+2% this month</p>
                </div>
              </div>
            </div>
          </div>

          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <div className="action-card">
                <div className="action-icon">👤</div>
                <h3>Manage Users</h3>
                <p>View and manage all user accounts</p>
                <button className="action-btn">View Users</button>
              </div>
              
              <div className="action-card">
                <div className="action-icon">💰</div>
                <h3>Donation Reports</h3>
                <p>Track and analyze donations</p>
                <button className="action-btn">View Reports</button>
              </div>
              
              <div className="action-card">
                <div className="action-icon">📋</div>
                <h3>Request Management</h3>
                <p>Review and approve aid requests</p>
                <button className="action-btn">Manage Requests</button>
              </div>
              
              <div className="action-card">
                <div className="action-icon">⚙️</div>
                <h3>System Settings</h3>
                <p>Configure platform settings</p>
                <button className="action-btn">Settings</button>
              </div>
            </div>
          </div>

          {user?.isSuperAdmin && (
            <div className="admin-management">
              <h2>Admin Management</h2>
              <AdminCreateForm />
            </div>
          )}

          <div className="recent-activity">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">✅</div>
                <div className="activity-content">
                  <h4>New donation received</h4>
                  <p>John Doe donated $500 to Gaza Aid Fund</p>
                  <span className="activity-time">2 hours ago</span>
                </div>
              </div>
              
              <div className="activity-item">
                <div className="activity-icon">👤</div>
                <div className="activity-content">
                  <h4>New user registered</h4>
                  <p>Sarah Wilson joined as a donor</p>
                  <span className="activity-time">4 hours ago</span>
                </div>
              </div>
              
              <div className="activity-item">
                <div className="activity-icon">📦</div>
                <div className="activity-content">
                  <h4>Aid request approved</h4>
                  <p>Medical supplies request for Rafah approved</p>
                  <span className="activity-time">6 hours ago</span>
                </div>
              </div>
              
              <div className="activity-item">
                <div className="activity-icon">💰</div>
                <div className="activity-content">
                  <h4>Funds distributed</h4>
                  <p>$2,000 distributed to local organizations</p>
                  <span className="activity-time">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <Profile />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard; 