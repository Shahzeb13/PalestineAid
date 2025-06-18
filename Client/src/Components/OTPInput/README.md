# OTP Input Component

A modern, responsive, and feature-rich OTP (One-Time Password) input component for React applications.

## Features

- ✨ **Auto-focus**: Automatically moves to the next input field
- 📋 **Paste Support**: Paste OTP from clipboard
- ⏰ **Resend Timer**: Built-in cooldown timer for resend functionality
- 📱 **Responsive**: Works perfectly on mobile devices
- 🎨 **Customizable**: Easy to customize styles and behavior
- 🔒 **Secure**: Input validation and security features
- ⌨️ **Keyboard Navigation**: Arrow keys and backspace support
- 🎯 **Accessible**: Proper ARIA labels and keyboard support

## Installation

The component is already included in your project. Simply import and use it:

```jsx
import OTPInput from './Components/OTPInput/OTPInput';
```

## Basic Usage

```jsx
import OTPInput from './Components/OTPInput/OTPInput';

const MyComponent = () => {
  const handleComplete = (otp) => {
    console.log('OTP entered:', otp);
    // Handle OTP verification
  };

  const handleResend = async () => {
    // Send OTP to user
    console.log('Resending OTP...');
  };

  return (
    <OTPInput
      length={6}
      onComplete={handleComplete}
      onResend={handleResend}
    />
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `length` | `number` | `6` | Number of OTP digits |
| `onComplete` | `function` | - | Callback when OTP is complete |
| `onResend` | `function` | - | Callback for resend functionality |
| `resendCooldown` | `number` | `60` | Cooldown time in seconds for resend |
| `title` | `string` | `"Enter OTP"` | Title displayed above the OTP inputs |
| `subtitle` | `string` | `"We've sent a verification code to your email"` | Subtitle text |
| `buttonText` | `string` | `"Verify"` | Text for the submit button |
| `resendText` | `string` | `"Resend OTP"` | Text for the resend button |
| `type` | `string` | `"verification"` | Type of OTP ("verification" or "reset") |

## Examples

### Email Verification

```jsx
const EmailVerification = () => {
  const handleVerifyOTP = async (otp) => {
    try {
      const response = await axios.post('/api/verify-otp', { otp });
      if (response.data.success) {
        toast.success('Email verified successfully!');
      }
    } catch (error) {
      toast.error('Verification failed');
    }
  };

  const handleSendOTP = async () => {
    try {
      await axios.post('/api/send-otp');
      toast.success('OTP sent successfully!');
    } catch (error) {
      toast.error('Failed to send OTP');
    }
  };

  return (
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
  );
};
```

### Password Reset

```jsx
const PasswordReset = () => {
  const handleResetOTP = async (otp) => {
    // Handle password reset with OTP
    console.log('Resetting password with OTP:', otp);
  };

  return (
    <OTPInput
      length={6}
      onComplete={handleResetOTP}
      onResend={handleSendOTP}
      resendCooldown={300} // 5 minutes
      title="Reset Your Password"
      subtitle="We've sent a 6-digit reset code to your email"
      buttonText="Reset Password"
      resendText="Resend Code"
      type="reset"
    />
  );
};
```

## Styling

The component comes with built-in styles, but you can customize them by modifying the CSS file:

```css
/* Custom styles */
.otp-input {
  /* Your custom styles */
}

.otp-submit-btn {
  /* Your custom button styles */
}
```

## Keyboard Support

- **Arrow Keys**: Navigate between input fields
- **Backspace**: Clear current field or move to previous field
- **Paste**: Paste OTP from clipboard
- **Tab**: Navigate through inputs
- **Enter**: Submit when OTP is complete

## Mobile Support

The component is fully responsive and optimized for mobile devices:

- Touch-friendly input fields
- Proper viewport handling
- Mobile-optimized spacing
- Touch keyboard support

## Demo

Visit `/otp-demo` in your application to see an interactive demonstration of the component.

## Integration with Backend

The component is designed to work with your existing backend API. Here's how to integrate it:

1. **Send OTP**: Call your backend API in the `onResend` callback
2. **Verify OTP**: Call your backend API in the `onComplete` callback
3. **Error Handling**: Use toast notifications for user feedback
4. **Loading States**: The component handles loading states automatically

## Troubleshooting

### Common Issues

1. **OTP not auto-focusing**: Make sure the component is mounted and visible
2. **Paste not working**: Ensure the pasted content contains only numbers
3. **Resend not working**: Check that the `onResend` callback is properly implemented
4. **Styling issues**: Verify that the CSS file is properly imported

### Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

To modify the component:

1. Edit `OTPInput.jsx` for functionality changes
2. Edit `OTPInput.css` for styling changes
3. Test thoroughly on different devices and browsers
4. Update this README if adding new features

## License

This component is part of the PalestineAid project and follows the same license terms. 