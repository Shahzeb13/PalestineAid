const axios = require('axios');

async function testEndpoint() {
    try {
        console.log('Testing stripe endpoint...');
        
        const response = await axios.post('http://localhost:5000/api/stripe/create-donation-payment-intent', {
            requestId: '507f1f77bcf86cd799439011', // Test ObjectId
            amount: 1000, // $10.00 in cents
            currency: 'usd',
            message: 'Test donation'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Response:', response.data);
        
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
    }
}

testEndpoint(); 