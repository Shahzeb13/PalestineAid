import { useState } from 'react';
import { toast } from 'react-toastify';
import OTPInput from '../OTPInput/OTPInput';
import './OTPDemo.css';

const OTPDemo = () => {
  const [demoType, setDemoType] = useState('verification');
  const [showOTP, setShowOTP] = useState(false);

  const handleSendOTP = async () => {
    // Simulate API call
    toast.success('OTP sent successfully! (Demo)');
    setShowOTP(true);
  };

  const handleVerifyOTP = async (otp) => {
    // Simulate verification
    toast.success(`OTP ${otp} verified successfully! (Demo)`);
    setTimeout(() => {
      setShowOTP(false);
    }, 2000);
  };

  const handleResetOTP = async (otp) => {
    // Simulate password reset
    toast.success(`Password reset with OTP ${otp} completed! (Demo)`);
    setTimeout(() => {
      setShowOTP(false);
    }, 2000);
  };

  const resetDemo = () => {
    setShowOTP(false);
    toast.info('Demo reset');
  };

  return (
    <div className="otp-demo">
      <div className="demo-header">
        <h1>OTP Component Demo</h1>
        <p>Interactive demonstration of the OTP input component</p>
      </div>

      {!showOTP ? (
        <div className="demo-selection">
          <h2>Choose Demo Type</h2>
          <div className="demo-options">
            <button
              className={`demo-option ${demoType === 'verification' ? 'active' : ''}`}
              onClick={() => setDemoType('verification')}
            >
              <div className="option-icon">📧</div>
              <div className="option-content">
                <h3>Email Verification</h3>
                <p>Verify your email address with OTP</p>
              </div>
            </button>
            
            <button
              className={`demo-option ${demoType === 'reset' ? 'active' : ''}`}
              onClick={() => setDemoType('reset')}
            >
              <div className="option-icon">🔐</div>
              <div className="option-content">
                <h3>Password Reset</h3>
                <p>Reset your password with OTP</p>
              </div>
            </button>
          </div>

          <button
            className="start-demo-btn"
            onClick={handleSendOTP}
          >
            Start Demo
          </button>
        </div>
      ) : (
        <div className="demo-otp">
          <OTPInput
            length={6}
            onComplete={demoType === 'verification' ? handleVerifyOTP : handleResetOTP}
            onResend={handleSendOTP}
            resendCooldown={30} // Shorter for demo
            title={demoType === 'verification' ? 'Verify Your Email' : 'Reset Your Password'}
            subtitle={demoType === 'verification' 
              ? 'We\'ve sent a 6-digit verification code to your email address'
              : 'We\'ve sent a 6-digit reset code to your email address'
            }
            buttonText={demoType === 'verification' ? 'Verify Email' : 'Reset Password'}
            resendText="Resend Code"
            type={demoType}
          />
          
          <button
            className="reset-demo-btn"
            onClick={resetDemo}
          >
            Reset Demo
          </button>
        </div>
      )}

      <div className="demo-features">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature">
            <div className="feature-icon">⌨️</div>
            <h3>Auto-focus</h3>
            <p>Automatically moves to next input field</p>
          </div>
          <div className="feature">
            <div className="feature-icon">📋</div>
            <h3>Paste Support</h3>
            <p>Paste OTP from clipboard</p>
          </div>
          <div className="feature">
            <div className="feature-icon">⏰</div>
            <h3>Resend Timer</h3>
            <p>Cooldown timer for resend functionality</p>
          </div>
          <div className="feature">
            <div className="feature-icon">📱</div>
            <h3>Responsive</h3>
            <p>Works perfectly on mobile devices</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🎨</div>
            <h3>Customizable</h3>
            <p>Easy to customize styles and behavior</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔒</div>
            <h3>Secure</h3>
            <p>Input validation and security features</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPDemo; 