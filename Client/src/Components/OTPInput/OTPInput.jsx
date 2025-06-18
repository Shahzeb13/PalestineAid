import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import './OTPInput.css';

const OTPInput = ({ 
  length = 6, 
  onComplete, 
  onResend, 
  resendCooldown = 60,
  title = "Enter OTP",
  subtitle = "We've sent a verification code to your email",
  buttonText = "Verify",
  resendText = "Resend OTP",
  type = "verification" // "verification" or "reset"
}) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const [activeInput, setActiveInput] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  useEffect(() => {
    // Focus the first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if current input is filled
    if (value && index < length - 1) {
      setActiveInput(index + 1);
      inputRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    if (newOtp.every(digit => digit !== '')) {
      const otpString = newOtp.join('');
      onComplete(otpString);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '') {
        // Move to previous input if current is empty
        if (index > 0) {
          setActiveInput(index - 1);
          inputRefs.current[index - 1]?.focus();
        }
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      setActiveInput(index - 1);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      setActiveInput(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, length);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      setActiveInput(Math.min(pastedData.length, length - 1));
      inputRefs.current[Math.min(pastedData.length, length - 1)]?.focus();
    }
  };

  const handleResend = async () => {
    console.log('=== OTP COMPONENT RESEND CLICKED ===');
    console.log('canResend:', canResend);
    console.log('isLoading:', isLoading);
    
    if (!canResend) {
      console.log('Resend blocked: cannot resend yet');
      return;
    }
    
    if (!onResend) {
      console.log('Resend blocked: no onResend function provided');
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Calling onResend function...');
      await onResend();
      console.log('onResend completed successfully');
      setResendTimer(resendCooldown);
      setCanResend(false);
      toast.success('OTP sent successfully!');
    } catch (error) {
      console.error('onResend failed:', error);
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    const otpString = otp.join('');
    if (otpString.length === length) {
      onComplete(otpString);
    } else {
      toast.error('Please enter the complete OTP');
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-header">
        <h2 className="otp-title">{title}</h2>
        <p className="otp-subtitle">{subtitle}</p>
      </div>

      <div className="otp-input-group">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => setActiveInput(index)}
            className={`otp-input ${activeInput === index ? 'active' : ''} ${
              digit ? 'filled' : ''
            }`}
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={otp.join('').length !== length || isLoading}
        className="otp-submit-btn"
      >
        {isLoading ? 'Verifying...' : buttonText}
      </button>

      <div className="otp-resend">
        <button
          onClick={handleResend}
          disabled={!canResend || isLoading}
          className="otp-resend-btn"
        >
          {canResend ? resendText : `Resend in ${resendTimer}s`}
        </button>
      </div>
    </div>
  );
};

export default OTPInput; 