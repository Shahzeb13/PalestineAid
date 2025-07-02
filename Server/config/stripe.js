const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create payment intent for donor to admin payment
const createDonationPaymentIntent = async (amount, currency = 'usd', metadata = {}) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount), // Amount is already in cents from frontend
            currency: currency.toLowerCase(),
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                ...metadata,
                payment_type: 'donor_to_admin',
                timestamp: new Date().toISOString()
            },
            // Add description for admin dashboard
            description: `Donation: ${metadata.donorName || 'Anonymous'} - ${metadata.requestName || 'General Donation'}`,
        });
        return paymentIntent;
    } catch (error) {
        console.error('Error creating donation payment intent:', error);
        throw error;
    }
};

// Get payment details for admin
const getPaymentDetails = async (paymentIntentId) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        return paymentIntent;
    } catch (error) {
        console.error('Error retrieving payment:', error);
        throw error;
    }
};

module.exports = {
    stripe,
    createDonationPaymentIntent,
    getPaymentDetails
};



// Frontend sends this to your server
// fetch('/api/stripe/create-payment-intent', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ amount: 50, currency: 'usd' })
// })
// Your server receives the request
// 1. Extracts amount and currency from req.body
// 2. Validates the data
// 3. Calls Stripe API
// 4. Returns client secret to frontend
// Your server receives the request
// 1. Extracts amount and currency from req.body
// 2. Validates the data
// 3. Calls Stripe API
// 4. Returns client secret to frontend
// Frontend uses client secret to complete payment
// stripe.confirmCardPayment(clientSecret, {
//     payment_method: { card: cardElement }
// })







// What You Need Instead:
// Donor Payment Flow:
// Donor pays Admin (Stripe)
// Admin's Stripe account receives money
// Admin gets notified of payment
// Admin-to-NGO Flow:
// Admin manually transfers money to NGO
// Could be bank transfer, check, etc.
// Admin updates donation status