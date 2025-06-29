const mongoose = require("mongoose")


const donatorDashboardSchema = new  mongoose.Schema({
    donaterId : {type: mongoose.Schema.Types.ObjectId , ref :"user" , required : true},
    requestId : {type : mongoose.Schema.Types.ObjectId , ref :"recieverDashboard" , required: true},
    adminId : {type : mongoose.Schema.Types.ObjectId , ref : "user" , required : true },
    
    // Donation details - donors always give money
    amount :{type: Number , min:0.01  , required : true },
    currency : { type: String , enum : ["USD" , "Pound" , "Rupees"] , required : true},
    
    // Optional message from donor
    message: {type: String, maxLength: 500},
    
    date: {type: Date, default: Date.now, required: true},
    status : {type : String , enum : ["Pending" , "Donated" , "Rejected"] , default: "Pending"},
    
    // Tracking fields
    processedBy: {type: mongoose.Schema.Types.ObjectId, ref: "user"}, // Which admin processed
    processedAt: {type: Date}, // When it was processed
    notes: {type: String} // Admin notes
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
})

// Indexes for better performance
donatorDashboardSchema.index({donaterId: 1, date: -1}) // For donor history
donatorDashboardSchema.index({requestId: 1}) // For request tracking
donatorDashboardSchema.index({status: 1}) // For status filtering

const donaterDashboardModel = mongoose.models.donaterDashboardModel ||  mongoose.model("donaterDashboardModel" , donatorDashboardSchema )
module.exports = donaterDashboardModel; 


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