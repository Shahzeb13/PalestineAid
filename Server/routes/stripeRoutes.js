const express = require('express');
const router = express.Router();
const {createDonationPaymentIntent , confirmDonation , getPaymentDetails}= require('../controllers/stripeController');
const {authenticateUser} = require('../middlewares/authenticateUser');

// Create donation payment intent (donor to admin)
router.post('/create-donation-payment-intent', authenticateUser, createDonationPaymentIntent);

// Confirm donation after payment
router.post('/confirm-donation', authenticateUser, confirmDonation);

// Get payment details for admin
router.get('/payment-details/:paymentIntentId', getPaymentDetails);

module.exports = router;