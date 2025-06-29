require('dotenv').config();
const { createPaymentIntent } = require('./config/stripe');

async function testStripe() {
    try {
        console.log('Testing simple Stripe integration...');
        
        const paymentIntent = await createPaymentIntent(10.00, 'usd');
        
        console.log('✅ Payment intent created!');
        console.log('ID:', paymentIntent.id);
        console.log('Client Secret:', paymentIntent.client_secret);
        console.log('Amount: $', paymentIntent.amount / 100);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('💡 Make sure STRIPE_SECRET_KEY is set in your .env file');
    }
}

testStripe(); 