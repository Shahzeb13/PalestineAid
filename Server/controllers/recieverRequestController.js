const recieverRequestModel = require("../models/recieverModel");
const userModel = require("../models/userModel");
const createTransporter = require("../config/nodeMailer.js")
const nodeMailer = require("nodemailer")







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

          const requesterEmail = user.email; // email of the person who files the request
          console.log(`Reqeuster Email :  ${requesterEmail}`);
          if (
            !recieverId || !requestName?.trim() || !requestDescription?.trim() ||
            !date || !location?.trim() || !urgencyLevel || !requestType ||
            !recieverRole || !deadline
          ) {
            return res.status(400).json({ success: false, message: "All fields are required" });
          }
          
          // Make proofImage optional or provide a default
          const imageUrl = proofImage?.trim() || "https://via.placeholder.com/400x300?text=No+Image+Provided";
          
          // Normalize enum values to match backend expectations
          const normalizedUrgencyLevel = urgencyLevel?.charAt(0).toUpperCase() + urgencyLevel?.slice(1).toLowerCase();
          const normalizedRequestType = requestType?.charAt(0).toUpperCase() + requestType?.slice(1).toLowerCase();
          const normalizedRecieverRole = recieverRole?.charAt(0).toUpperCase() + recieverRole?.slice(1).toLowerCase();
          
          // Validate enum values
          const validUrgencyLevels = ["Low", "Medium", "High"];
          const validRequestTypes = ["Money", "Food", "Clothes", "Shelter", "Medical"];
          const validRecieverRoles = ["Individual", "Family", "Organization"];
          
          if (!validUrgencyLevels.includes(normalizedUrgencyLevel)) {
            return res.status(400).json({ success: false, message: "Invalid urgency level. Must be Low, Medium, or High" });
          }
          
          if (!validRequestTypes.includes(normalizedRequestType)) {
            return res.status(400).json({ success: false, message: "Invalid request type. Must be Money, Food, Clothes, Shelter, or Medical" });
          }
          
          if (!validRecieverRoles.includes(normalizedRecieverRole)) {
            return res.status(400).json({ success: false, message: "Invalid receiver role. Must be Individual, Family, or Organization" });
          }
          
        // Create request without status - it will default to "Pending"
        const recieverRequest = await recieverRequestModel.create({
            recieverId, 
            requestName, 
            requestDescription, 
            date, 
            location, 
            urgencyLevel: normalizedUrgencyLevel, 
            requestType: normalizedRequestType, 
            recieverRole: normalizedRecieverRole, 
            deadline, 
            proofImage: imageUrl
        });

        try {
          const mailOptions = {
            from: process.env.USER,
            to:requesterEmail ,
            subject: "Welcome to PalestineAid!",
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>PalestineAid</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
                    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
                    .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
                    .content { padding: 40px 30px; line-height: 1.6; }
                    .message { background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 5px; }
                    .footer { background-color: #f8f9fa; padding: 20px 30px; text-align: center; color: #666; font-size: 14px; }
                    .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: 500; }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="header">
                        <h1>�� PalestineAid</h1>
                        <p>Connecting Hearts, Building Hope</p>
                    </div>
                    <div class="content">
                        <h2>Welcome to PalestineAid!</h2>
                        <p>Dear <strong>${user.name}</strong>,</p>
                        <div class="message">
                            <p>Your request Have been successfully Submitted: <strong>${requesterEmail}</strong></p>
                            <p>Thank you for joining our community of hope and support.</p>
                        </div>
                        <p>You can now:</p>
                        <ul>
                            <li>Create aid requests if you're a receiver</li>
                            <li>Browse and donate to verified requests if you're a donater</li>
                            <li>Manage and approve requests if you're an admin</li>
                        </ul>
                        <a href="http://localhost:3000/login" class="button">Login to Your Account</a>
                    </div>
                    <div class="footer">
                        <p>© 2025 PalestineAid. All rights reserved.</p>
                        <p>This email was sent to ${requesterEmail}</p>
                    </div>
                </div>
            </body>
            </html>`
        };
          const transporter = await createTransporter();
          await transporter.sendMail(mailOptions);
      } catch (emailError) {
          console.error('Email sending failed:', {
            message :emailError.message,
            stack : emailError.stack,
            body: req.body
          }
          );

          // Don't fail registration if email fails
      }


        return res.status(201).json({
            success: true, 
            message: "Receiver request created successfully", 
            requestId: recieverRequest._id, 
            recieverRequest
        });

    } catch (error) {
        console.error('Receiver request creation failed:', {
            message: error.message,
            stack: error.stack,
            body: req.body
        });
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