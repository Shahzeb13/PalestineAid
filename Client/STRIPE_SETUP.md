# Stripe Integration Setup Guide

## Prerequisites
1. A Stripe account (sign up at https://stripe.com)
2. Your Stripe publishable key

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the Client directory with your Stripe publishable key:

```env
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# API Configuration
VITE_API_URL=http://localhost:5000/api
```

### 3. Update Stripe Key in Code
In `src/pages/DonaterDashboard/DonaterDashboard.jsx`, update the Stripe key:

```javascript
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here');
```

### 4. Backend Configuration
Make sure your backend has the following environment variables:
```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
```

### 5. Test Cards
For testing, you can use these Stripe test card numbers:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires Authentication**: 4000 0025 0000 3155

## Features
- ✅ Secure payment processing with Stripe
- ✅ Beautiful donation modal with card input
- ✅ Real-time payment validation
- ✅ Success/error handling
- ✅ Responsive design
- ✅ Loading states and animations

## Security Notes
- Never expose your Stripe secret key in the frontend
- Always use HTTPS in production
- Validate all payment data on the backend
- Use webhooks for payment confirmation in production

## Troubleshooting
1. **Payment fails**: Check your Stripe keys and network connectivity
2. **Modal doesn't open**: Ensure Stripe dependencies are installed
3. **CORS errors**: Verify your backend CORS configuration
4. **Environment variables not loading**: Restart your development server after adding .env file 