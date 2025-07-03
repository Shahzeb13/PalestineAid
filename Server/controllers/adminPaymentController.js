const donaterModel = require('../models/donaterModel');
const userModel = require('../models/userModel');

// Get all donations that admin needs to pay to NGO
exports.getPendingAdminPayments = async (req, res) => {
    try {
        const userId = req.user.id; // Use userId from req.user

        // Validate if user is an admin
        const admin = await userModel.findById(userId);
        if (!admin || admin.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admins can view pending payments"
            });
        }

        // Get all donations where admin received money but hasn't paid NGO yet
        const pendingPayments = await donaterModel.find({
            adminId: userId,
            paymentStatus: "completed", // Donor paid admin
            adminPaymentStatus: "pending" // Admin hasn't paid NGO yet
        })
        .populate("donaterId", "name email")
        .populate("requestId", "requestName requestDescription location urgencyLevel requestType role deadline")
        .sort({ date: -1 }); // Most recent first

        return res.json({
            success: true,
            message: "Pending admin payments retrieved successfully",
            total: pendingPayments.length,
            totalAmount: pendingPayments.reduce((sum, payment) => sum + payment.amount, 0),
            payments: pendingPayments.map(payment => ({
                id: payment._id,
                amount: payment.amount,
                currency: payment.currency,
                date: payment.date,
                donor: payment.donaterId,
                request: payment.requestId,
                message: payment.message,
                stripePaymentIntentId: payment.stripePaymentIntentId
            }))
        });

    } catch (err) {
        console.error("Get pending admin payments error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to get pending payments"
        });
    }
};

// Mark admin payment as completed (admin paid NGO)
exports.completeAdminPayment = async (req, res) => {
    try {
        const userId = req.user.id; // Use userId from req.user
        const { donationId, paymentMethod, notes } = req.body;

        // Validate if user is an admin
        const admin = await userModel.findById(userId);
        if (!admin || admin.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admins can complete payments"
            });
        }

        // Validate required fields
        if (!donationId || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: donationId, paymentMethod"
            });
        }

        // Find the donation
        const donation = await donaterModel.findOne({
            _id: donationId,
            adminId: userId,
            paymentStatus: "completed",
            adminPaymentStatus: "pending"
        });

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: "Donation not found or already processed"
            });
        }

        // Update admin payment status
        donation.adminPaymentStatus = "completed";
        donation.adminPaymentDate = new Date();
        donation.adminPaymentMethod = paymentMethod;
        donation.adminPaymentNotes = notes || "";
        donation.processedBy = userId;
        donation.processedAt = new Date();

        await donation.save();

        return res.json({
            success: true,
            message: "Admin payment marked as completed",
            donation: {
                id: donation._id,
                amount: donation.amount,
                currency: donation.currency,
                adminPaymentStatus: donation.adminPaymentStatus,
                adminPaymentDate: donation.adminPaymentDate,
                adminPaymentMethod: donation.adminPaymentMethod
            }
        });

    } catch (err) {
        console.error("Complete admin payment error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to complete admin payment"
        });
    }
};

// Get admin payment history
exports.getAdminPaymentHistory = async (req, res) => {
    try {
        const userId = req.user.id; // Use userId from req.user

        // Validate if user is an admin
        const admin = await userModel.findById(userId);
        if (!admin || admin.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admins can view payment history"
            });
        }

        // Get all donations processed by this admin
        const paymentHistory = await donaterModel.find({
            adminId: userId,
            adminPaymentStatus: "completed"
        })
        .populate("donaterId", "name email")
        .populate("requestId", "requestName requestDescription location")
        .sort({ adminPaymentDate: -1 }); // Most recent first

        return res.json({
            success: true,
            message: "Admin payment history retrieved successfully",
            total: paymentHistory.length,
            totalAmount: paymentHistory.reduce((sum, payment) => sum + payment.amount, 0),
            payments: paymentHistory.map(payment => ({
                id: payment._id,
                amount: payment.amount,
                currency: payment.currency,
                donor: payment.donaterId,
                request: payment.requestId,
                adminPaymentDate: payment.adminPaymentDate,
                adminPaymentMethod: payment.adminPaymentMethod,
                adminPaymentNotes: payment.adminPaymentNotes
            }))
        });

    } catch (err) {
        console.error("Get admin payment history error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to get payment history"
        });
    }
}; 