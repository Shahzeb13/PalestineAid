const donationIntentModel = require('../models/donationIntentModel');
const userModel = require('../models/userModel');
const donaterModel = require('../models/donaterModel');
const adminDashboardModel = require('../models/adminModel');

// Save donation intent from homepage widget
exports.saveDonationIntent = async (req, res) => {
    try {
        const { amount, message, email, currency = 'usd' } = req.body;

        // Validate required fields
        if (!amount || !email) {
            return res.status(400).json({
                success: false,
                message: "Amount and email are required"
            });
        }

        // Validate amount
        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount must be greater than 0"
            });
        }

        // Create donation intent
        const donationIntent = new donationIntentModel({
            amount: parseFloat(amount),
            message: message || "",
            email: email.toLowerCase(),
            currency: currency.toLowerCase()
        });

        await donationIntent.save();

        return res.json({
            success: true,
            message: "Donation intent saved successfully",
            donationIntent: {
                id: donationIntent._id,
                amount: donationIntent.amount,
                message: donationIntent.message,
                email: donationIntent.email,
                status: donationIntent.status,
                expiresAt: donationIntent.expiresAt
            }
        });

    } catch (err) {
        console.error("Save donation intent error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to save donation intent"
        });
    }
};

// Get pending donation intents by email
exports.getPendingIntentsByEmail = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const intents = await donationIntentModel.find({
            email: email.toLowerCase(),
            status: "pending",
            expiresAt: { $gt: new Date() }
        }).sort({ createdAt: -1 });

        return res.json({
            success: true,
            message: "Pending donation intents retrieved successfully",
            intents: intents.map(intent => ({
                id: intent._id,
                amount: intent.amount,
                message: intent.message,
                currency: intent.currency,
                createdAt: intent.createdAt,
                expiresAt: intent.expiresAt
            }))
        });

    } catch (err) {
        console.error("Get pending intents error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to get pending donation intents"
        });
    }
};

// Convert donation intent to actual donation (when user registers/logs in)
exports.convertIntentToDonation = async (req, res) => {
    try {
        const { intentId, userId } = req.body;

        if (!intentId || !userId) {
            return res.status(400).json({
                success: false,
                message: "Intent ID and user ID are required"
            });
        }

        // Find the donation intent
        const intent = await donationIntentModel.findById(intentId);
        if (!intent || intent.status !== "pending") {
            return res.status(404).json({
                success: false,
                message: "Donation intent not found or already processed"
            });
        }

        // Check if intent has expired
        if (intent.expiresAt < new Date()) {
            intent.status = "expired";
            await intent.save();
            return res.status(400).json({
                success: false,
                message: "Donation intent has expired"
            });
        }

        // Get a confirmed request and its admin
        const confirmedRequest = await adminDashboardModel.findOne({
            requestStatus: "Confirmed"
        }).populate("adminId", "_id");

        if (!confirmedRequest) {
            return res.status(404).json({
                success: false,
                message: "No confirmed requests available for donation"
            });
        }

        // Create actual donation record
        const donation = new donaterModel({
            donaterId: userId,
            requestId: confirmedRequest.requestId,
            adminId: confirmedRequest.adminId._id,
            amount: intent.amount,
            currency: intent.currency,
            message: intent.message,
            status: "Pending",
            paymentStatus: "pending"
        });

        await donation.save();

        // Update intent status
        intent.status = "completed";
        intent.userId = userId;
        intent.completedAt = new Date();
        intent.convertedToDonation = donation._id;
        await intent.save();

        return res.json({
            success: true,
            message: "Donation intent converted successfully",
            donation: {
                id: donation._id,
                amount: donation.amount,
                currency: donation.currency,
                message: donation.message,
                status: donation.status,
                requestId: donation.requestId,
                adminId: donation.adminId
            }
        });

    } catch (err) {
        console.error("Convert intent to donation error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to convert donation intent"
        });
    }
};

// Clean up expired donation intents (can be run as a cron job)
exports.cleanupExpiredIntents = async (req, res) => {
    try {
        const result = await donationIntentModel.updateMany(
            { 
                status: "pending", 
                expiresAt: { $lt: new Date() } 
            },
            { status: "expired" }
        );

        return res.json({
            success: true,
            message: `Cleaned up ${result.modifiedCount} expired donation intents`
        });

    } catch (err) {
        console.error("Cleanup expired intents error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to cleanup expired intents"
        });
    }
}; 