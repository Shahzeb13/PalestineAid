import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateSuperAdmin.css';

const CreateSuperAdmin = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if super admin exists
    console.log("CreateSuperAdmin Mounted ")
    const checkSuperAdmin = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/check-super-admin');
        console.log('Super admin check response:', res.data);
        if (res.data.exists) {
          navigate('/login', { replace: true });
        } else {
          setChecking(false);
        }
      } catch (err) {
        setError('Failed to check super admin status.');
        setChecking(false);
      }
    };
    checkSuperAdmin();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/create-first-super-admin', formData);
      if (response.data.success) {
        setSuccess('Super admin created successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create super admin.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="superadmin-container">
        <div className="max-w-md">
          <h2>Checking super admin status...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="superadmin-container">
      <div className="max-w-md">
        <h2>Create Super Admin</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            required
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {error && <div className="text-red-600">{error}</div>}
          {success && <div className="text-green-600">{success}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Super Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateSuperAdmin; 