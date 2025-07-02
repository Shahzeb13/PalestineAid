import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [otpForm, setOtpForm] = useState({ email: '', otp: '' });
  const [resetForm, setResetForm] = useState({ 
    email: '', 
    otp: '', 
    newPassword: '', 
    confirmPassword: '' 
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/auth/logout', {}, { 
        withCredentials: true 
      });
      logout();
      setShowDropdown(false);
      navigate('/');
      setMessage({ text: 'Logged out successfully!', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Logout failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/auth/verify-otp', { 
        email: otpForm.email,
        otp: otpForm.otp 
      }, { withCredentials: true });
      setMessage({ text: 'OTP verified successfully!', type: 'success' });
      setShowOtpModal(false);
      setOtpForm({ email: '', otp: '' });
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Invalid OTP', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (resetForm.newPassword !== resetForm.confirmPassword) {
      setMessage({ text: 'Passwords do not match!', type: 'error' });
      return;
    }
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/auth/reset-password', { 
        email: resetForm.email,
        otp: resetForm.otp,
        newPassword: resetForm.newPassword 
      });
      setMessage({ text: 'Password reset successfully!', type: 'success' });
      setShowResetModal(false);
      setResetForm({ email: '', otp: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Password reset failed', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
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

  // Only show auth buttons on landing page when not authenticated
  const isLandingPage = location.pathname === '/';
  const shouldShowAuthButtons = isLandingPage && !isAuthenticated;

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <span className="brand-icon">🤝</span>
            <span className="brand-text">Palestine Aid</span>
          </Link>

          <div className="navbar-menu">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>
            <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
              About
            </Link>
            <Link to="/volunteer" className={`nav-link ${location.pathname === '/volunteer' ? 'active' : ''}`}>
              Volunteer
            </Link>
            <Link to="/resources" className={`nav-link ${location.pathname === '/resources' ? 'active' : ''}`}>
              Resources
            </Link>
            <Link to="/news" className={`nav-link ${location.pathname === '/news' ? 'active' : ''}`}>
              News
            </Link>
            <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>
              Contact
            </Link>
          </div>

          <div className="navbar-auth">
            {isAuthenticated ? (
              <div className="user-menu">
                <button 
                  className="user-button"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <span className="user-avatar">👤</span>
                  <span className="user-name">{user?.name || user?.email}</span>
                  <span className="dropdown-arrow">▼</span>
                </button>
                
                {showDropdown && (
                  <div className="dropdown-menu">
                    {user?.role === 'admin' ? (
                      <Link to="/admin-dashboard" className="dropdown-item">
                        <span className="dropdown-icon">⚙️</span>
                        Admin Dashboard
                      </Link>
                    ) : user?.role === 'donater' ? (
                      <Link to="/donater-dashboard" className="dropdown-item">
                        <span className="dropdown-icon">💝</span>
                        Donater Dashboard
                      </Link>
                    ) : (
                      <Link to="/dashboard" className="dropdown-item">
                        <span className="dropdown-icon">📊</span>
                        Dashboard
                      </Link>
                    )}
                    <Link to="/profile" className="dropdown-item">
                      <span className="dropdown-icon">👤</span>
                      Profile
                    </Link>
                    <button 
                      className="dropdown-item logout"
                      onClick={handleLogout}
                      disabled={loading}
                    >
                      <span className="dropdown-icon">🚪</span>
                      {loading ? 'Logging out...' : 'Logout'}
                    </button>
                  </div>
                )}
              </div>
            ) : shouldShowAuthButtons ? (
              <div className="auth-buttons">
                <Link to="/login" className="auth-button secondary">
                  Login
                </Link>
                <Link to="/register" className="auth-button primary">
                  Register
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </nav>

      {/* Message Toast */}
      {message.text && (
        <div className={`message-toast ${message.type}`}>
          <span className="message-text">{message.text}</span>
          <button className="message-close" onClick={clearMessage}>×</button>
        </div>
      )}

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="modal-overlay" onClick={() => setShowOtpModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Verify OTP</h2>
              <button 
                className="close-button" 
                onClick={() => setShowOtpModal(false)}
              >
                ×
              </button>
            </div>
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
                <label>OTP</label>
                <input
                  type="text"
                  value={otpForm.otp}
                  onChange={(e) => setOtpForm({...otpForm, otp: e.target.value})}
                  required
                  placeholder="Enter OTP"
                  maxLength="6"
                />
              </div>
              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="action-button secondary"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="action-button primary"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="modal-overlay" onClick={() => setShowResetModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reset Password</h2>
              <button 
                className="close-button" 
                onClick={() => setShowResetModal(false)}
              >
                ×
              </button>
            </div>
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
                <label>OTP</label>
                <input
                  type="text"
                  value={resetForm.otp}
                  onChange={(e) => setResetForm({...resetForm, otp: e.target.value})}
                  required
                  placeholder="Enter OTP"
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
                  disabled={loading}
                  className="action-button secondary"
                >
                  {loading ? 'Sending...' : 'Send Reset OTP'}
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="action-button primary"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar; 