require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function testStripeConnection() {
    try {
        console.log('Testing Stripe connection...');
        console.log('API Key:', process.env.STRIPE_SECRET_KEY ? 'Set' : 'NOT SET');
        
        if (!process.env.STRIPE_SECRET_KEY) {
            console.error('❌ STRIPE_SECRET_KEY is not set in .env file');
            return;
        }

        // Test basic connection
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 1000, // $10.00
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        console.log('✅ Stripe connection successful!');
        console.log('Payment Intent ID:', paymentIntent.id);
        console.log('Status:', paymentIntent.status);
        console.log('Client Secret:', paymentIntent.client_secret);

    } catch (error) {
        console.error('❌ Stripe connection failed:');
        console.error('Error type:', error.type);
        console.error('Error message:', error.message);
        
        if (error.type === 'StripeConnectionError') {
            console.log('\n💡 This is a network issue. Check:');
            console.log('1. Internet connection');
            console.log('2. Firewall settings');
            console.log('3. DNS settings');
        } else if (error.type === 'StripeAuthenticationError') {
            console.log('\n💡 This is an API key issue. Check:');
            console.log('1. STRIPE_SECRET_KEY in .env file');
            console.log('2. API key is valid and active');
            console.log('3. Using test key for testing');
        }
    }
}

testStripeConnection(); 