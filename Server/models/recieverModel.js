const mongoose = require("mongoose");


const recieverDashboardSchema = new mongoose.Schema({
    recieverId: {type: mongoose.Schema.Types.ObjectId , ref: "user" , required: true},
    requestName: { type: String, required: true},
    requestDescription: {type: String, required: true},
    date : {type: Date , required: true},
    location : {type: String , required: true},
    urgencyLevel :{type: String , enum : ["low" , "medium" , "high"] , required: true},
    requestType : {type: String , enum : ["money" , "food" , "clothes"] , required: true},
    role : {type: String , enum : ["individual" , "family" , "organization"] , required: true},
    deadline : {type: Date , required: true},
    status : {type: String , 
        enum : ["confirmed" , "pending" , "rejected"],
        default : "pending"
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

