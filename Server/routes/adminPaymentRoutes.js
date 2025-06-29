const express = require('express');
const router = express.Router();
const { getPendingAdminPayments , completeAdminPayment , getAdminPaymentHistory} = require('../controllers/adminPaymentController');
const { authenticateUser  } = require('../middlewares/authenticateUser');

// Get pending payments that admin needs to pay to NGO
router.get('/pending-payments', authenticateUser, getPendingAdminPayments);

// Mark admin payment as completed (admin paid NGO)
router.post('/complete-payment', authenticateUser, completeAdminPayment);

// Get admin payment history
router.get('/payment-history', authenticateUser, getAdminPaymentHistory);

module.exports = router; 