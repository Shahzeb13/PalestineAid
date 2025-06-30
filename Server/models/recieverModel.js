const mongoose = require("mongoose");


const recieverDashboardSchema = new mongoose.Schema({
    recieverId: {type: mongoose.Schema.Types.ObjectId , ref: "user" , required: true},
    requestName: { type: String, required: true},
    requestDescription: {type: String, required: true},
    date : {type: Date , required: true},
    location : {type: String , required: true},
    urgencyLevel :{type: String , enum : ["Low" , "Medium" , "High"] , required: true},
    requestType : {type: String , enum : ["Money" , "Food" , "Clothes"  ,"Shelter" ,"Medical"] , required: true},
    recieverRole : {type: String , enum : ["Individual" , "Family" , "Organization" , ] , required: true},
    deadline : {type: Date , required: true},
    status : {type: String , 
        enum : ["Confirmed" , "Pending" , "Rejected"],
        default : "Pending"
    },
    proofImage : {type:String  , required: true},   
    

})

const recieverDashboard = mongoose.models.recieverDashboard  || mongoose.model('recieverDashboard' , recieverDashboardSchema );

module.exports = recieverDashboard;




// Receiver:
// What data would receiver send ???
// Requrest name:
// Req Description:
// Date :
// Location: 
// Urgency level:
// What does receiver needL money or food or clothes 
// Role : 
// Also ! when does he need it like a deadline!
// Status:
// Proof image:

