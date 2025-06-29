# Stripe Integration Setup Guide

This guide will help you set up Stripe payment processing in your Palestine Aid application.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Node.js and npm installed
3. Your Palestine Aid application running

## Step 1: Get Your Stripe API Keys

1. Log in to your Stripe Dashboard
2. Go to Developers → API Keys
3. Copy your **Publishable Key** and **Secret Key**
4. For testing, use the test keys (they start with `pk_test_` and `sk_test_`)

## Step 2: Set Up Environment Variables

Add the following variables to your `.env` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Step 3: Set Up Stripe Webhooks (Optional but Recommended)

1. In your Stripe Dashboard, go to Developers → Webhooks
2. Click "Add endpoint"
3. Set the endpoint URL to: `https://your-domain.com/api/stripe/webhook`
4. Select these events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret and add it to your `.env` file

## Step 4: Install Dependencies

The Stripe package has already been installed. If you need to reinstall:

```bash
npm install stripe
```

## API Endpoints

### 1. Create Payment Intent
**POST** `/api/stripe/create-payment-intent`

Creates a payment intent for a donation.

**Request Body:**
```json
{
  "requestId": "request_id_here",
  "amount": 50.00,
  "currency": "usd",
  "message": "Optional donation message"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment intent created successfully",
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx",
  "customerId": "cus_xxx"
}
```

### 2. Confirm Donation
**POST** `/api/stripe/confirm-donation`

Confirms a donation after payment is completed.

**Request Body:**
```json
{
  "paymentIntentId": "pi_xxx",
  "requestId": "request_id_here",
  "amount": 50.00,
  "currency": "usd",
  "message": "Optional donation message"
}
```

### 3. Get Payment Status
**GET** `/api/stripe/payment-status/:paymentIntentId`

Gets the status of a payment.

**Response:**
```json
{
  "success": true,
  "paymentStatus": "succeeded",
  "amount": 50.00,
  "currency": "usd",
  "created": 1640995200
}
```

### 4. Webhook Endpoint
**POST** `/api/stripe/webhook`

Handles Stripe webhook events (automatically called by Stripe).

## Frontend Integration

### 1. Install Stripe.js

Add Stripe.js to your HTML:

```html
<script src="https://js.stripe.com/v3/"></script>
```

### 2. Initialize Stripe

```javascript
const stripe = Stripe('pk_test_your_publishable_key_here');
```

### 3. Create Payment Flow

```javascript
// 1. Create payment intent
const createPaymentIntent = async (requestId, amount, currency, message) => {
  const response = await fetch('/api/stripe/create-payment-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      requestId,
      amount,
      currency,
      message
    })
  });
  
  const data = await response.json();
  return data.clientSecret;
};

// 2. Confirm payment
const confirmPayment = async (clientSecret) => {
  const result = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: elements.getElement('card'),
      billing_details: {
        name: 'Donor Name',
        email: 'donor@example.com'
      }
    }
  });
  
  if (result.error) {
    console.error('Payment failed:', result.error);
  } else {
    console.log('Payment succeeded:', result.paymentIntent);
    // Call your confirm-donation endpoint
  }
};
```

## Testing

### Test Card Numbers

Use these test card numbers in Stripe test mode:

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Requires Authentication:** `4000 0025 0000 3155`

### Test CVC and Expiry

- **CVC:** Any 3 digits (e.g., `123`)
- **Expiry:** Any future date (e.g., `12/25`)

## Security Considerations

1. **Never expose your secret key** in frontend code
2. **Always verify webhook signatures** (handled automatically)
3. **Use HTTPS** in production
4. **Validate all input data** on the server
5. **Store payment intent IDs** to prevent duplicate charges

## Error Handling

Common errors and solutions:

- **400 Bad Request:** Check required fields
- **403 Forbidden:** User not authenticated or not a donater
- **404 Not Found:** Request not found or not confirmed
- **500 Internal Server Error:** Check server logs

## Production Deployment

1. Switch to live Stripe keys
2. Set up proper webhook endpoints
3. Use HTTPS
4. Monitor webhook events
5. Set up proper error logging

## Support

For Stripe-specific issues, refer to:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Support](https://support.stripe.com/) 