import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import './FirstAdminSetup.css';

const FirstAdminSetup = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { createSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create super admin using AuthContext
      await createSuperAdmin(formData);
      
      toast.success('Super admin created successfully!');
      
      // Call success callback to update app state
      if (onSuccess) {
        onSuccess();
      }
      
      // Redirect to admin dashboard
      navigate('/admin-dashboard');
      
    } catch (error) {
      console.error('Super admin creation error:', error);
      toast.error(error.response?.data?.message || 'Failed to create super admin');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="first-admin-setup">
      <div className="setup-card">
        <h2>Setup Super Admin</h2>
        <p>Create the first super admin account for PalestineAid</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Super Admin Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Super Admin Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Super Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FirstAdminSetup; 