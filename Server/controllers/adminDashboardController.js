const adminDashboardModel = require("../models/adminModel")
const userModel = require("../models/userModel");
const recieverModel = require("../models/recieverModel")
exports.getAllRequests = async(req , res ) => {
 


    try{
        const {userId , role} = req.body;
    
    if(!userId && !role){
        return res.json({success : false , message: "Required details missing"})
    }
    
    const user =await userModel.findOne({_id :userId});
    if(!user){
        return res.json({success: false , message: "User not found"});

    }

    if(user.role !== role || role !== "admin"){
        return res.json({success: false , message: "User is not an admin"})
    }

    const requests = await recieverModel
    .find()
    .populate("recieverId", "name email role");

    

    return res.json({success: true , message : "All Reciever request Retrieved Successfully" ,
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


