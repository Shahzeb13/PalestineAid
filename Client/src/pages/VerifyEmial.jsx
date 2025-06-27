import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import OTPInput from '../Components/OTPInput/OTPInput';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleSendOTP = async () => {
    try {
      console.log('Sending OTP request...');
      
      const response = await axios.post(
        'http://localhost:5000/api/auth/send-otp',
        {}, // No need to send userId - middleware will add it
        { withCredentials: true }
      );

      console.log('OTP response:', response.data);

      if (response.data.success) {
        toast.success('OTP sent successfully!');
      }
    } catch (error) {
      console.error('OTP sending error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      const errorMessage = error.response?.data?.message || 'Failed to send OTP';
      toast.error(errorMessage);
      
      // If it's an authentication error, redirect to login
      if (error.response?.status === 401) {
        toast.error('Please login first');
        navigate('/login');
      }
      
      throw error;
    }
  };

  const handleVerifyOTP = async (otp) => {
    setIsLoading(true);
    try {
      console.log('Verifying OTP:', otp);
      
      const response = await axios.post(
        'http://localhost:5000/api/auth/verify-otp',
        { otp }, // No need to send userId - middleware will add it
        { withCredentials: true }
      );

      console.log('OTP verification response:', response.data);

      if (response.data.success) {
        setIsVerified(true);
        toast.success('Email verified successfully!');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 'Verification failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Test authentication on component mount
  useEffect(() => {
    const testAuth = async () => {
      try {
        const response = await axios.post(
          'http://localhost:5000/api/auth/is-auth',
          {},
          { withCredentials: true }
        );
        console.log('Authentication test successful:', response.data);
      } catch (error) {
        console.error('Authentication test failed:', error);
        toast.error('Please login first');
        navigate('/login');
      }
    };
    
    testAuth();
  }, [navigate]);

  // Simple test function
  const testOTP = async () => {
    console.log('=== TESTING OTP SENDING ===');
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/send-otp',
        {},
        { withCredentials: true }
      );
      console.log('✅ OTP Test Success:', response.data);
      toast.success('OTP test successful!');
    } catch (error) {
      console.log('❌ OTP Test Failed:', error.response?.data || error.message);
      toast.error('OTP test failed: ' + (error.response?.data?.message || error.message));
    }
  };

  if (isVerified) {
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
          <h2 style={{ color: "#1e293b", marginBottom: "0.5rem" }}>Email Verified!</h2>
          <p style={{ color: "#64748b" }}>Your email has been successfully verified. Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "1rem"
    }}>
      {/* Test button for debugging */}
      <div style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        zIndex: 1000
      }}>
        <button
          onClick={testOTP}
          style={{
            background: "#ef4444",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "0.875rem"
          }}
        >
          Test OTP
        </button>
      </div>

      <OTPInput
        length={6}
        onComplete={handleVerifyOTP}
        onResend={handleSendOTP}
        resendCooldown={60}
        title="Verify Your Email"
        subtitle="We've sent a 6-digit verification code to your email address"
        buttonText="Verify Email"
        resendText="Resend Code"
        type="verification"
      />
    </div>
  );
};

export default VerifyEmail;
