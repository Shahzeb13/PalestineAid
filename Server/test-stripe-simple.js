require('dotenv').config();
const { createDonationPaymentIntent } = require('./config/stripe');

async function testStripe() {
    try {
        console.log('Testing Stripe configuration...');
        console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
        
        const paymentIntent = await createDonationPaymentIntent(1000, 'usd', {
            donorName: 'Test Donor',
            requestName: 'Test Request'
        });
        
        console.log('Payment intent created successfully:', {
            id: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            client_secret: paymentIntent.client_secret ? 'EXISTS' : 'MISSING'
        });
        
    } catch (error) {
        console.error('Stripe test failed:', error.message);
    }
}

testStripe(); 