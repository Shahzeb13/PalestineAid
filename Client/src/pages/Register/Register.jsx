import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    if (!formData.role) {
      setError('Please select a role.');
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      if (response.data.success) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>
      
      <div className="register-card">
        <div className="register-header">
          <div className="register-logo">
            <span className="logo-icon">🤝</span>
            <h1>PalestineAid</h1>
          </div>
          <h2>Create Your Account</h2>
          <p>Join our community of hope and support</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-wrapper">
              <span className="input-icon" style={{display:'none'}}>👤</span>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon" style={{display:'none'}}>📧</span>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon" style={{display:'none'}}>🔒</span>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role">I want to</label>
            <div className="input-wrapper">
              <span className="input-icon" style={{display:'none'}}>🎯</span>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="" disabled>
                  Choose your role
                </option>
                <option value="donater">Donate to help others</option>
                <option value="receiver">Request aid and support</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
          
          {success && (
            <div className="success-message">
              <span className="success-icon">✅</span>
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>Already have an account?</p>
          <Link to="/login" className="login-link">
            Sign In to Your Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register; 