import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // OTP States
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [otpForm, setOtpForm] = useState({ email: '', otp: '' });
  const [resetForm, setResetForm] = useState({ 
    email: '', 
    otp: '', 
    newPassword: '', 
    confirmPassword: '' 
  });
  const [otpLoading, setOtpLoading] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/auth/is-auth', { 
        withCredentials: true 
      });
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        setError('Failed to load user profile');
      }
    } catch (error) {
      setError('You must be logged in to view your profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      setOtpLoading(true);
      await axios.post('http://localhost:5000/api/auth/send-otp', { 
        email: otpForm.email 
      }, { withCredentials: true });
      setMessage({ text: 'OTP sent successfully!', type: 'success' });
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Failed to send OTP', 
        type: 'error' 
      });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setOtpLoading(true);
      await axios.post('http://localhost:5000/api/auth/verify-otp', { 
        email: otpForm.email,
        otp: otpForm.otp 
      }, { withCredentials: true });
      setMessage({ text: 'OTP verified successfully!', type: 'success' });
      setOtpForm({ email: '', otp: '' });
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Invalid OTP', 
        type: 'error' 
      });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSendResetOtp = async (e) => {
    e.preventDefault();
    try {
      setOtpLoading(true);
      await axios.post('http://localhost:5000/api/auth/send-reset-password-otp', { 
        email: resetForm.email 
      });
      setMessage({ text: 'Reset OTP sent successfully!', type: 'success' });
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Failed to send reset OTP', 
        type: 'error' 
      });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (resetForm.newPassword !== resetForm.confirmPassword) {
      setMessage({ text: 'Passwords do not match!', type: 'error' });
      return;
    }
    try {
      setOtpLoading(true);
      await axios.post('http://localhost:5000/api/auth/reset-password', { 
        email: resetForm.email,
        otp: resetForm.otp,
        newPassword: resetForm.newPassword 
      });
      setMessage({ text: 'Password reset successfully!', type: 'success' });
      setResetForm({ email: '', otp: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Password reset failed', 
        type: 'error' 
      });
    } finally {
      setOtpLoading(false);
    }
  };

  const clearMessage = () => {
    setMessage({ text: '', type: '' });
  };

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(clearMessage, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <div className="error-icon">⚠️</div>
          <h3>Access Denied</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Your Profile</h1>
        <p>Manage your account and security settings</p>
      </div>

      <div className="profile-content">
        {/* User Information Card */}
        <div className="profile-card user-info">
          <div className="card-header">
            <h2>👤 Personal Information</h2>
          </div>
          <div className="user-details">
            <div className="detail-row">
              <span className="label">Name:</span>
              <span className="value">{user?.name || 'Not provided'}</span>
            </div>
            <div className="detail-row">
              <span className="label">Email:</span>
              <span className="value">{user?.email}</span>
            </div>
            <div className="detail-row">
              <span className="label">Role:</span>
              <span className="value role-badge">{user?.role}</span>
            </div>
            <div className="detail-row">
              <span className="label">Account Created:</span>
              <span className="value">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
              </span>
            </div>
          </div>
        </div>

        {/* OTP Management Card */}
        <div className="profile-card otp-management">
          <div className="card-header">
            <h2>🔐 Security & OTP</h2>
            <button 
              className="toggle-button"
              onClick={() => setShowOtpSection(!showOtpSection)}
            >
              {showOtpSection ? 'Hide' : 'Show'} OTP Options
            </button>
          </div>
          
          {showOtpSection && (
            <div className="otp-sections">
              {/* Send & Verify OTP */}
              <div className="otp-section">
                <h3>📧 Send & Verify OTP</h3>
                <form onSubmit={handleVerifyOtp} className="otp-form">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={otpForm.email}
                      onChange={(e) => setOtpForm({...otpForm, email: e.target.value})}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="form-group">
                    <label>OTP Code</label>
                    <input
                      type="text"
                      value={otpForm.otp}
                      onChange={(e) => setOtpForm({...otpForm, otp: e.target.value})}
                      required
                      placeholder="Enter 6-digit OTP"
                      maxLength="6"
                    />
                  </div>
                  <div className="form-actions">
                    <button 
                      type="button" 
                      onClick={handleSendOtp}
                      disabled={otpLoading}
                      className="action-button secondary"
                    >
                      {otpLoading ? 'Sending...' : 'Send OTP'}
                    </button>
                    <button 
                      type="submit" 
                      disabled={otpLoading}
                      className="action-button primary"
                    >
                      {otpLoading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Reset Password */}
              <div className="otp-section">
                <h3>🔑 Reset Password</h3>
                <form onSubmit={handleResetPassword} className="reset-form">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={resetForm.email}
                      onChange={(e) => setResetForm({...resetForm, email: e.target.value})}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="form-group">
                    <label>OTP Code</label>
                    <input
                      type="text"
                      value={resetForm.otp}
                      onChange={(e) => setResetForm({...resetForm, otp: e.target.value})}
                      required
                      placeholder="Enter 6-digit OTP"
                      maxLength="6"
                    />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      value={resetForm.newPassword}
                      onChange={(e) => setResetForm({...resetForm, newPassword: e.target.value})}
                      required
                      placeholder="Enter new password"
                      minLength="6"
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      value={resetForm.confirmPassword}
                      onChange={(e) => setResetForm({...resetForm, confirmPassword: e.target.value})}
                      required
                      placeholder="Confirm new password"
                      minLength="6"
                    />
                  </div>
                  <div className="form-actions">
                    <button 
                      type="button" 
                      onClick={handleSendResetOtp}
                      disabled={otpLoading}
                      className="action-button secondary"
                    >
                      {otpLoading ? 'Sending...' : 'Send Reset OTP'}
                    </button>
                    <button 
                      type="submit" 
                      disabled={otpLoading}
                      className="action-button primary"
                    >
                      {otpLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Account Statistics */}
        <div className="profile-card account-stats">
          <div className="card-header">
            <h2>📊 Account Statistics</h2>
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <h3>Member Since</h3>
                <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🔐</div>
              <div className="stat-content">
                <h3>Account Status</h3>
                <p className="status-active">Active</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">📧</div>
              <div className="stat-content">
                <h3>Email Verified</h3>
                <p>{user?.emailVerified ? '✅ Yes' : '❌ No'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Toast */}
      {message.text && (
        <div className={`message-toast ${message.type}`}>
          <span className="message-text">{message.text}</span>
          <button className="message-close" onClick={clearMessage}>×</button>
        </div>
      )}
    </div>
  );
};

export default Profile; 