const adminDashboardModel = require("../models/adminModel");
const recieverModel = require("../models/recieverModel");
const donaterModel = require("../models/donaterModel");
const userModel = require("../models/userModel");

exports.getConfirmedRequests = async (req, res) => {
    try {
        const { userId } = req.body; // From middleware

        // Validate if user is a donater
        const donater = await userModel.findById(userId);
        if (!donater || donater.role !== "donater") {
            return res.status(403).json({
                success: false,
                message: "Only donaters can view confirmed requests"
            });
        }

        // Get all confirmed requests from admin dashboard
        const confirmedRequests = await adminDashboardModel.find({
            requestStatus: "Confirmed"
        })
        .populate("requestId", "requestName requestDescription location urgencyLevel requestType role deadline")
        .populate("userId", "name email")
        .populate("adminId", "name email");

        return res.json({
            success: true,
            message: "Confirmed requests retrieved successfully",
            total: confirmedRequests.length,
            requests: confirmedRequests
        });

    } catch (err) {
        console.error("Get confirmed requests error:", {
            error: err.message,
            stack: err.stack,
            body: req.body
        });

        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again.",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};


//-----------------------getRequestDetails-----------------------------------

exports.getRequestDetails = async (req, res) => {
    try {
        const { userId } = req.body; // From middleware
        const { requestId } = req.params;

        // Validate if user is a donater
        const donater = await userModel.findById(userId);
        if (!donater || donater.role !== "donater") {
            return res.status(403).json({
                success: false,
                message: "Only donaters can view request details"
            });
        }

        // First, get the original request details
        const request = await recieverModel.findById(requestId);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found"
            });
        }

        // Then, get the admin approval details
        const adminEntry = await adminDashboardModel.findOne({
            requestId: requestId,
            requestStatus: "Confirmed"
        })
        .populate("adminId", "name email");

        if (!adminEntry) {
            return res.status(404).json({
                success: false,
                message: "Request not found or not confirmed by admin"
            });
        }

        // Get receiver details
        const receiver = await userModel.findById(request.recieverId).select("name email");

        return res.json({
            success: true,
            message: "Request details retrieved successfully",
            request: {
                // Original request details
                requestId: request._id,
                requestName: request.requestName,
                requestDescription: request.requestDescription,
                location: request.location,
                urgencyLevel: request.urgencyLevel,
                requestType: request.requestType,
                role: request.recieverRole,
                deadline: request.deadline,
                date: request.date,
                proofImage: request.proofImage,
                
                // Receiver details
                receiver: {
                    id: receiver._id,
                    name: receiver.name,
                    email: receiver.email
                },
                
                // Admin approval details
                adminApproval: {
                    adminId: adminEntry.adminId._id,
                    adminName: adminEntry.adminId.name,
                    adminEmail: adminEntry.adminId.email,
                    approvalStatus: adminEntry.requestStatus,
                    approvalDate: adminEntry.createdAt
                }
            }
        });
// {
//     "success": true,
//     "message": "Request details retrieved successfully",
//     "request": {
//       "requestId": "request_id",
//       "requestName": "Food for Gaza",
//       "requestDescription": "Need food supplies",
//       "location": "Gaza",
//       "urgencyLevel": "High",
//       "requestType": "Food",
//       "role": "Family",
//       "deadline": "2024-01-15T00:00:00.000Z",
//       "date": "2024-01-01T00:00:00.000Z",
//       "proofImage": "image_url",
      
//       "receiver": {
//         "id": "receiver_user_id",
//         "name": "John Doe",
//         "email": "john@example.com"
//       },
      
//       "adminApproval": {
//         "adminId": "admin_user_id",
//         "adminName": "Admin User",
//         "adminEmail": "admin@example.com",
//         "approvalStatus": "Confirmed",
//         "approvalDate": "2024-01-02T00:00:00.000Z"
//       }
//     }
//   }
    } catch (err) {
        console.error("Get request details error:", {
            error: err.message,
            stack: err.stack,
            body: req.body
        });

        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again.",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

exports.handleDonation = async (req, res) => {
    try {
        const { userId } = req.body; // From middleware
        const { action, amount, currency, message } = req.body;
        const requestId = req.params.requestId;
        // Validate if user is a donater
        const donater = await userModel.findById(userId);
        if (!donater || donater.role !== "donater") {
            return res.status(403).json({
                success: false,
                message: "Only donaters can make donations"
            });
        }

        // Validate required fields
        if (!requestId || !action || !amount || !currency) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: requestId, action, amount, currency"
            });
        }

        // Validate action
        if (!["donate", "reject"].includes(action)) {
            return res.status(400).json({
                success: false,
                message: "Action must be either 'donate' or 'reject'"
            });
        }

        // Check if request exists and is confirmed
        const adminEntry = await adminDashboardModel.findOne({//adminEntry means that If req is confirmed by admin or not
            requestId: requestId,
            requestStatus: "Confirmed"
        });

        if (!adminEntry) {
            return res.status(404).json({
                success: false,
                message: "Request not found or not confirmed"
            });
        }

        // Create donation record
        const donation = new donaterModel({
            donaterId: userId,
            requestId: requestId,
            adminId: adminEntry.adminId,
            amount: amount,
            currency: currency,
            message: message || "",
            status: action === "donate" ? "Donated" : "Rejected"
        });

        await donation.save();

        return res.json({
            success: true,
            message: `Request ${action}d successfully`,
            donation: {
                id: donation._id,
                amount: donation.amount,
                currency: donation.currency,
                status: donation.status,
                date: donation.date
            }
        });

    } catch (err) {
        console.error("Handle donation error:", {
            error: err.message,
            stack: err.stack,
            body: req.body
        });

        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again.",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}; 