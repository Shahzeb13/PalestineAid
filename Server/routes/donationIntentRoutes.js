const express = require('express');
const router = express.Router();
const { 
    saveDonationIntent, 
    getPendingIntentsByEmail, 
    convertIntentToDonation, 
    cleanupExpiredIntents 
} = require('../controllers/donationIntentController');
const { authenticateUser } = require('../middlewares/authenticateUser');

// Public routes (no auth required)
router.post('/save-intent', saveDonationIntent);
router.get('/pending-intents', getPendingIntentsByEmail);

// Protected routes (auth required)
router.post('/convert-intent', authenticateUser, convertIntentToDonation);
router.post('/cleanup-expired', authenticateUser, cleanupExpiredIntents);

module.exports = router; 