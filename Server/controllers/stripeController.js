const { createDonationPaymentIntent, getPaymentDetails } = require('../config/stripe');
const donaterModel = require('../models/donaterModel');
const userModel = require('../models/userModel');
const adminDashboardModel = require('../models/adminModel');

// Create payment intent for donor to admin payment
exports.createDonationPaymentIntent = async (req, res) => {
    try {
        const { userId } = req.body; // From middleware
        const { requestId, amount, currency = 'usd', message } = req.body;

        // Validate if user is a donater
        const donater = await userModel.findById(userId);
        if (!donater || donater.role !== "donater") {
            return res.status(403).json({
                success: false,
                message: "Only donaters can make donations"
            });
        }

        // Validate required fields
        if (!requestId || !amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Missing or invalid required fields: requestId, amount"
            });
        }

        // Check if request exists and is confirmed
        const adminEntry = await adminDashboardModel.findOne({
            requestId: requestId,
            requestStatus: "Confirmed"
        });

        if (!adminEntry) {
            return res.status(404).json({
                success: false,
                message: "Request not found or not confirmed"
            });
        }

        // Get request details for metadata
        const request = await adminDashboardModel.findById(requestId).populate('requestId');

        // Create payment intent with metadata
        const paymentIntent = await createDonationPaymentIntent(amount, currency, {
            donorId: userId,
            donorName: donater.name,
            donorEmail: donater.email,
            requestId: requestId,
            requestName: request?.requestId?.requestName || 'General Donation',
            adminId: adminEntry.adminId.toString(),
            message: message || "",
            donationType: 'donor_to_admin'
        });

        return res.json({
            success: true,
            message: "Payment intent created successfully",
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            amount: amount,
            currency: currency
        });

    } catch (err) {
        console.error("Create donation payment intent error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to create payment intent"
        });
    }
};

// Confirm donation after payment (donor to admin)
exports.confirmDonation = async (req, res) => {
    try {
        const { userId } = req.body; // From middleware
        const { paymentIntentId, requestId, amount, currency, message } = req.body;

        // Validate if user is a donater
        const donater = await userModel.findById(userId);
        if (!donater || donater.role !== "donater") {
            return res.status(403).json({
                success: false,
                message: "Only donaters can confirm donations"
            });
        }

        // Validate required fields
        if (!paymentIntentId || !requestId || !amount || !currency) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: paymentIntentId, requestId, amount, currency"
            });
        }

        // Get payment details from Stripe
        const paymentDetails = await getPaymentDetails(paymentIntentId);
        
        if (paymentDetails.status !== 'succeeded' && process.env.NODE_ENV === 'production') {
            return res.status(400).json({
                success: false,
                message: "Payment not completed successfully"
            });
        }

        // Check if request exists and is confirmed
        const adminEntry = await adminDashboardModel.findOne({
            requestId: requestId,
            requestStatus: "Confirmed"
        });

        if (!adminEntry) {
            return res.status(404).json({
                success: false,
                message: "Request not found or not confirmed"
            });
        }

        // Create donation record (donor paid admin)
        const donation = new donaterModel({
            donaterId: userId,
            requestId: requestId,
            adminId: adminEntry.adminId,
            amount: amount,
            currency: currency,
            message: message || "",
            status: "Donated", // Donor successfully paid admin
            stripePaymentIntentId: paymentIntentId,
            paymentStatus: "completed", // Payment to admin completed
            adminPaymentStatus: "pending" // Admin hasn't paid NGO yet
        });

        await donation.save();

        return res.json({
            success: true,
            message: "Donation to admin confirmed successfully",
            donation: {
                id: donation._id,
                amount: donation.amount,
                currency: donation.currency,
                status: donation.status,
                date: donation.date,
                paymentIntentId: donation.stripePaymentIntentId,
                adminPaymentStatus: donation.adminPaymentStatus
            }
        });

    } catch (err) {
        console.error("Confirm donation error:", {
            error: err.message,
            stack: err.stack,
            body: req.body,
            userId: req.body.userId,
            paymentIntentId: req.body.paymentIntentId,
            requestId: req.body.requestId
        });
        return res.status(500).json({
            success: false,
            message: "Failed to confirm donation",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

// Get payment details for admin dashboard
exports.getPaymentDetails = async (req, res) => {
    try {
        const { paymentIntentId } = req.params;

        if (!paymentIntentId) {
            return res.status(400).json({
                success: false,
                message: "Payment intent ID is required"
            });
        }

        const paymentDetails = await getPaymentDetails(paymentIntentId);

        return res.json({
            success: true,
            paymentStatus: paymentDetails.status,
            amount: paymentDetails.amount / 100, // Convert from cents
            currency: paymentDetails.currency,
            created: paymentDetails.created,
            metadata: paymentDetails.metadata,
            description: paymentDetails.description
        });

    } catch (err) {
        console.error("Get payment details error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to get payment details"
        });
    }
}; 