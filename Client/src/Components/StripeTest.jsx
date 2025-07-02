import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here');

const TestPaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (!stripe || !elements) {
      setError('Stripe not loaded');
      setLoading(false);
      return;
    }

    // This is just a test - in real app you'd create payment intent first
    const paymentIntentResponse = await axios.post(
      'http://localhost:5000/api/stripe/create-donation-payment-intent',
      {
        requestId: request.requestId._id,
        amount: parseFloat(amount) * 100, // Convert to cents
        currency: 'usd',
        message: message
      },
      { withCredentials: true }
    );

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: user?.name || 'Anonymous Donor',
          email: user?.email
        }
      }
    });

    if (stripeError) {
      setError(stripeError.message);
    } else {
      const confirmResponse = await axios.post(
        'http://localhost:5000/api/stripe/confirm-donation',
        {
          paymentIntentId: paymentIntent.id,
          requestId: request.requestId._id,
          amount: parseFloat(amount) * 100,
          currency: 'usd',
          message: message
        },
        { withCredentials: true }
      );
      setError('Test completed (no real payment)');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '20px auto', padding: '20px' }}>
      <h3>Stripe Test</h3>
      <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>
        <CardElement />
      </div>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Test Payment'}
      </button>
    </form>
  );
};

const StripeTest = () => {
  return (
    <Elements stripe={stripePromise}>
      <TestPaymentForm />
    </Elements>
  );
};

export default StripeTest; 