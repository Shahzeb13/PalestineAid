const userModel = require('../models/userModel.js')


exports.getUserData =async (req , res) => {


    const {userId} =  req.body;


    try {

        const user = await userModel.findById(userId);
        
        if(!user){
             return res.status(404).json({ success: false , message: "User not Found"});
        }


        res.json({
            success: true ,
            userData : {
                username : user.name,
                isAccountVerified  : user.isAccountVerified
            }
        })

        return res.status(200).json({success: true , message: "User Data sent successfully!"})

    }
    catch (err){
        return res.status(500).json({success: false , message : err.message})
    }
}