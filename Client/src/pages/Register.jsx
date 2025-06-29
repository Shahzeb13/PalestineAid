import { useState } from "react";
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { useAuth } from "../Context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("donater");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const errors = [];
    let strength = 0;
    
    if (password.length >= 8) {
      strength += 1;
    } else {
      errors.push("At least 8 characters");
    }
    
    if (/[A-Z]/.test(password)) {
      strength += 1;
    } else {
      errors.push("One uppercase letter");
    }
    
    if (/[a-z]/.test(password)) {
      strength += 1;
    } else {
      errors.push("One lowercase letter");
    }
    
    if (/\d/.test(password)) {
      strength += 1;
    } else {
      errors.push("One number");
    }
    
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      strength += 1;
    } else {
      errors.push("One special character");
    }
    
    return { errors, strength };
  };

  const validateName = (name) => {
    const errors = [];
    
    if (name.length < 2) {
      errors.push("At least 2 characters");
    }
    
    if (name.length > 50) {
      errors.push("Less than 50 characters");
    }
    
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      errors.push("Letters and spaces only");
    }
    
    return errors;
  };

  // Handle input changes with validation
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    
    if (value) {
      const nameErrors = validateName(value);
      setErrors(prev => ({
        ...prev,
        name: nameErrors.length > 0 ? nameErrors : null
      }));
    } else {
      setErrors(prev => ({ ...prev, name: null }));
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value) {
      if (!validateEmail(value)) {
        setErrors(prev => ({
          ...prev,
          email: "Please enter a valid email address"
        }));
      } else {
        setErrors(prev => ({ ...prev, email: null }));
      }
    } else {
      setErrors(prev => ({ ...prev, email: null }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    
    if (value) {
      const { errors: passwordErrors, strength } = validatePassword(value);
      setPasswordStrength(strength);
      setErrors(prev => ({
        ...prev,
        password: passwordErrors.length > 0 ? passwordErrors : null
      }));
    } else {
      setPasswordStrength(0);
      setErrors(prev => ({ ...prev, password: null }));
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "#ef4444";
    if (passwordStrength <= 3) return "#f59e0b";
    if (passwordStrength <= 4) return "#3b82f6";
    return "#10b981";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Fair";
    if (passwordStrength <= 4) return "Good";
    return "Strong";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Final validation before submission
    const nameErrors = validateName(name);
    const emailValid = validateEmail(email);
    const { errors: passwordErrors } = validatePassword(password);
    
    const finalErrors = {};
    if (nameErrors.length > 0) finalErrors.name = nameErrors;
    if (!emailValid) finalErrors.email = "Please enter a valid email address";
    if (passwordErrors.length > 0) finalErrors.password = passwordErrors;
    
    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      setIsLoading(false);
      toast.error("Please fix the validation errors");
      return;
    }

    try {
      await register({ name, email, password, role });
      toast.success("Registration successful!");
      setName("");
      setPassword("");
      setEmail("");
      setRole("donater");
      setErrors({});
      setPasswordStrength(0);
      navigate('/dashboard');
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.errors) {
        setErrors(errorData.errors);
        toast.error(errorData.message);
      } else {
        const errMsg = errorData?.message || "Registration failed";
        toast.error(errMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
      
      <div className="auth-card register-form">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-icon">🕊️</span>
            <h1 className="logo-text" style={{ color: "black" }}>PalestineAid</h1>
          </div>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join us to make a difference together</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={name}
                onChange={handleNameChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                required
              />
            </div>
            {errors.name && (
              <div className="error-message">
                {Array.isArray(errors.name) ? errors.name.map((err, index) => (
                  <div key={index}>• {err}</div>
                )) : errors.name}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                required
              />
            </div>
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Create a strong password"
                value={password}
                onChange={handlePasswordChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                required
              />
            </div>
            {errors.password && (
              <div className="error-message">
                {Array.isArray(errors.password) ? errors.password.map((err, index) => (
                  <div key={index}>• {err}</div>
                )) : errors.password}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="role" className="form-label">Role</label>
            <div className="input-wrapper">
              <span className="input-icon">👥</span>
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-input"
                required
              >
                <option value="donater">Donor</option>
                <option value="receiver">Receiver</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <div className="auth-links">
            <Link to="/login" className="auth-link">
              Already have an account? <span>Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;