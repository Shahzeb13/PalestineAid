const mongoose = require("mongoose");

const adminDashboardSchema = mongoose.Schema({
    adminId : {type :mongoose.Schema.Types.ObjectId , ref : "user" ,  required: true } , 
    userId : { type : mongoose.Schema.Types.ObjectId , ref : "user" , required: true},
    requestId : {type : mongoose.Schema.Types.ObjectId , ref:"recieverDashboard" , required : true},
    requestStatus : {type: String , enum : ["Confirmed" , "Approved" , "Rejected"] , default:"Pending"}
}
)

adminDashboardSchema.index({userId : 1 , requestId: 1 } , {unique : true})


const adminDashboard = mongoose.models.adminDashboard || mongoose.model("adminDashboard" ,adminDashboardSchema)

module.exports = adminDashboard