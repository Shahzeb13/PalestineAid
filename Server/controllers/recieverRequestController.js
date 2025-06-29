const recieverRequestModel = require("../models/recieverModel");
const userModel = require("../models/userModel");







exports.handleRecieverRequest = async (req , res) => {

    try {

        const {
            userId,
            requestName,
            requestDescription,
            date,
            location,
            urgencyLevel,
            requestType,
            recieverRole,
            deadline,
            proofImage
          } = req.body;
          

          const recieverId = userId;

          const user = await userModel.findById(recieverId);
          if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
          }
          
          if (
            !recieverId || !requestName?.trim() || !requestDescription?.trim() ||
            !date || !location?.trim() || !urgencyLevel || !requestType ||
            !recieverRole || !deadline || !proofImage?.trim()
          ) {
            return res.status(400).json({ success: false, message: "All fields are required" });
          }
          
        // Create request without status - it will default to "Pending"
        const recieverRequest = await recieverRequestModel.create({
            recieverId, 
            requestName, 
            requestDescription, 
            date, 
            location, 
            urgencyLevel, 
            requestType, 
            recieverRole, 
            deadline, 
            proofImage
        });

        return res.status(201).json({
            success: true, 
            message: "Receiver request created successfully", 
            requestId: recieverRequest._id, 
            recieverRequest
        });

    } catch (error) {
        return res.status(500).json({success: false, message: error.message})
    }
}








//---------------------------------------Get Reciever Dashboard Data---------------------------------------


exports.getRecieverDashboardData = async (req, res) => {
  try {
    const recieverId = req.params.id;

    const totalRequests = await recieverRequestModel.countDocuments({ recieverId });

    const approvedRequests = await recieverRequestModel.find({ recieverId, status: "Confirmed" });
    const pendingRequests = await recieverRequestModel.find({ recieverId, status: "Pending" });
    const rejectedRequests = await recieverRequestModel.find({ recieverId, status: "Rejected" });

    const latestRequest = await recieverRequestModel.findOne({ recieverId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        totalRequests,
        approvedRequests,
        pendingRequests,
        rejectedRequests,
        currentStatus: latestRequest?.status || "N/A",
        deliveryLocation: latestRequest?.location || "N/A",
        latestRequest: latestRequest || null
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}






//---------------------------------------Get Single Request Data---------------------------------------

exports.getSingleRequestData = async (req , res) => {
  try {
    const requestId = req.params.requestId;
    const request = await recieverRequestModel.findById(requestId);
    res.status(200).json({success: true , request});
  } catch (err) {
    res.status(500).json({success: false , message: err.message});
  }
}


//---------------------------------------Update Request---------------------------------------

exports.updateRequest = async (req , res) => {
  try {
    const requestId = req.params.requestId;
    const {updateData} = req.body;
    if(!requestId) {
      return res.status(400).json({success: false , message: "Request ID is required"});
    }

    const request = await recieverRequestModel.findById(requestId);
    if(!request) {
      return res.status(404).json({success: false , message: "Request not found"});
    }

    await recieverRequestModel.findByIdAndUpdate(requestId , updateData , {new: true});
    return res.status(200).json({success: true , message: "Request updated successfully"});
  }

  catch (err) {
    return res.status(500).json({success: false , message: err.message});
  }
}


//---------------------------------------Delete Request---------------------------------------



exports.deleteRequest = async (req , res) => {
  try {
    const requestId = req.params.requestId;
    
    const request = await recieverRequestModel.findById(requestId);
    if(!request) {
      return res.status(404).json({success: false , message: "Request not found"});
    }
    await recieverRequestModel.findByIdAndDelete(requestId);
    return res.status(200).json({success: true , message: "Request deleted successfully"});
  }
  catch(err){
    return res.status(500).json({success: false , message: err.message});
  }
}