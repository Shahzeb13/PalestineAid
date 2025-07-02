const adminDashboardModel = require("../models/adminModel")
const userModel = require("../models/userModel");
const recieverModel = require("../models/recieverModel")



//--------------------------Get All the requests---------------------------------

exports.getAllRequests = async(req , res ) => {
    try{
        // Get userId and role from authenticated user (from JWT token)
        const userId = req.user.id;
        const role = req.user.role;
        
        console.log('Admin getAllRequests - userId:', userId, 'role:', role);
    
        if(!userId || !role){
            return res.status(400).json({success : false , message: "Authentication required"})
        }
    
        const user = await userModel.findOne({_id :userId});
        if(!user){
            return res.status(404).json({success: false , message: "User not found"});
        }

        console.log('Found user:', user.email, 'with role:', user.role);

        if(user.role !== role || role !== "admin"){
            return res.status(403).json({success: false , message: "User is not an admin"})
        }

        const requests = await recieverModel
        .find()
        .populate("recieverId", "name email role");

        console.log('Found requests:', requests.length);

        return res.status(200).json({success: true , message : "All Reciever request Retrieved Successfully" ,
            Total: requests.length,
            requests
        })
    }
    catch (err){
        console.error("Admin Requests fetch error" , {
            error: err.message,
            stack: err.stack ,
            body : err.body
        })

        return res.status(500).json({
            success: false, 
            message : "Internal server error. Please try again.",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}

//-------------------------Get a Single Request---------------------------------

exports.getSingleRequestDetails =async (req , res) => {

    try{
        const requestId  = req.params.requestId;

        const request =await recieverModel.findById(requestId);

        if(!request){
            return res.status(404).json({success : false , message: "No request was found"})

            }
    
        return res.status(200).json({success: true , message : "Details for single request Sent Successfully" ,  data:request})

    }
    catch(err){

        console.error({
            message: err.message,
            stack :err.stack,
            body: req.body
        })
        return res.status(500).json({
            success: false, 
            message : "Internal server error. Please try again.",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}

//--------------------------Handle Approval------------------------------------
exports.approveUserRequest = async (req, res) => {
    try {
        // Get userId and role from authenticated user (from JWT token)
        const userId = req.user.id;
        const role = req.user.role;
        const { action } = req.body; // action: "approve" or "reject"
        const requestId = req.params.requestId;
        
        // Validate required fields
        if (!userId || !role || !requestId || !action) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: userId, role, requestId, action"
            });
        }

        // Validate action
        if (!["approve", "reject"].includes(action?.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: "Action must be either 'approve' or 'reject'"
            });
        }
        
        // Check if user is admin
        const admin = await userModel.findById(userId);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin user not found"
            });
        }

        if (admin.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "User is not authorized to approve requests"
            });
        }

        // Check if request exists
        const request = await recieverModel.findById(requestId);
        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found"
            });
        }

        // Debug: Log the actual status
        console.log('Request status:', request.status);
        console.log('Expected status:', "Pending");

        // Check if request is already processed - use "Pending" to match schema
        if (request.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message: `Request is already ${request.status}`
            });
        }

        // Update request status - use lowercase action for consistency
        const actionLower = action.toLowerCase();
        const newStatus = actionLower === "approve" ? "Confirmed" : "Rejected";
        const updatedRequest = await recieverModel.findByIdAndUpdate(
            requestId,
            { status: newStatus },
            { new: true }
        ).populate("recieverId", "name email");

        // Create admin dashboard entry to track the action b  
        const adminDashboardEntry = new adminDashboardModel({
            adminId: userId,
            userId: request.recieverId,
            requestId: requestId,
            requestStatus: newStatus
        });
        await adminDashboardEntry.save();

        return res.json({
            success: true,
            message: `Request ${action}d successfully`,
            request: updatedRequest,
            adminAction: {
                adminId: userId,
                action: action,
                timestamp: new Date()
            }
        });

    } catch (err) {
        console.error("Approve/Reject Request error", {
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
}
