import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import OTPInput from '../Components/OTPInput/OTPInput';
import PasswordResetModal from '../Components/PasswordResetModal/PasswordResetModal';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentOTP, setCurrentOTP] = useState('');

  const handleSendOTP = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/sendpassResetOTP',
        { email }
      );

      if (response.data.success) {
        setShowOTP(true);
        toast.success('OTP sent successfully!');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send OTP';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (otp) => {
    if (!email) {
      toast.error('Email not found');
      return;
    }

    setCurrentOTP(otp);
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = async (newPassword) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/resetPassword',
        { email, otp: currentOTP, newPassword }
      );

      if (response.data.success) {
        setIsReset(true);
        setShowPasswordModal(false);
        toast.success('Password reset successfully!');
        
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password reset failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isReset) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      }}>
        <div style={{
          background: "white",
          padding: "3rem",
          borderRadius: "16px",
          textAlign: "center",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
        }}>
          <div style={{
            width: "80px",
            height: "80px",
            background: "#10b981",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem"
          }}>
            <span style={{ fontSize: "2rem", color: "white" }}>✓</span>
          </div>
          <h2 style={{ color: "#1e293b", marginBottom: "0.5rem" }}>Password Reset!</h2>
          <p style={{ color: "#64748b" }}>Your password has been successfully reset. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (!showOTP) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      }}>
        <div style={{
          background: "white",
          padding: "2rem",
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          maxWidth: "400px",
          width: "100%",
          margin: "1rem"
        }}>
          <h2 style={{ 
            textAlign: "center", 
            color: "#1e293b", 
            marginBottom: "1rem",
            fontSize: "1.5rem",
            fontWeight: "700"
          }}>
            Reset Password
          </h2>
          <p style={{ 
            textAlign: "center", 
            color: "#64748b", 
            marginBottom: "2rem",
            fontSize: "0.9rem"
          }}>
            Enter your email address and we'll send you a code to reset your password.
          </p>
          
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "0.875rem",
              border: "2px solid #e2e8f0",
              borderRadius: "12px",
              fontSize: "1rem",
              marginBottom: "1.5rem",
              outline: "none",
              transition: "border-color 0.3s ease"
            }}
            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
          />
          
          <button
            onClick={handleSendOTP}
            disabled={isLoading || !email}
            style={{
              width: "100%",
              padding: "0.875rem",
              background: isLoading || !email ? "#94a3b8" : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: isLoading || !email ? "not-allowed" : "pointer",
              transition: "all 0.3s ease"
            }}
          >
            {isLoading ? 'Sending...' : 'Send Reset Code'}
          </button>
          
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <Link to="/login" style={{ 
              color: "#3b82f6", 
              textDecoration: "none",
              fontSize: "0.875rem"
            }}>
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "1rem"
      }}>
        <OTPInput
          length={6}
          onComplete={handleVerifyOTP}
          onResend={handleSendOTP}
          resendCooldown={300} // 5 minutes for password reset
          title="Reset Your Password"
          subtitle={`We've sent a 6-digit reset code to ${email}`}
          buttonText="Reset Password"
          resendText="Resend Code"
          type="reset"
        />
      </div>

      <PasswordResetModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handlePasswordSubmit}
        isLoading={isLoading}
      />
    </>
  );
};

export default ResetPassword;
