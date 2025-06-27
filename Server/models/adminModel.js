const mongoose = require("mongoose");

const adminDashboardSchema = mongoose.Schema({
    adminId : {type :mongoose.Schema.Types.ObjectId , ref : "User" ,  required: true } , 
    userId : { type : mongoose.Schema.Types.ObjectId , ref : "User" , required: true},
    requestId : {type : mongoose.Schema.Types.ObjectId , ref:"recieverDashboard" , required : true},
    requestStatus : {type: String , enum : ["pending" , "approved" , "rejected"] , default:"pending"}
}
)

adminDashboardSchema.index({userId : 1 , requestId: 1 } , {unique : true})


const adminDashboard = mongoose.models.adminDashboard || mongoose.model("adminDashboard" ,adminDashboardSchema)

module.exports = adminDashboard