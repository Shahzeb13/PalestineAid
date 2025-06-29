const express = require('express');
const donaterRouter = express.Router();
const { getConfirmedRequests, getRequestDetails, handleDonation } = require("../controllers/donaterController");
const { authenticateUser } = require("../middlewares/authenticateUser.js");

donaterRouter.get("/confirmedRequests", authenticateUser, getConfirmedRequests);
donaterRouter.get("/request/:requestId", authenticateUser, getRequestDetails);
donaterRouter.post("/donate/:requestId", authenticateUser, handleDonation);

module.exports = donaterRouter; 

// /confirmedRequests response
// {
//     "success": true,
//     "message": "Confirmed requests retrieved successfully",
//     "total": 2,
//     "requests": [
//         {
//             "_id": "685ffc19142fa94e13c6da20",
//             "adminId": {
//                 "_id": "685cde296b09dc591904ddad",
//                 "name": "Shahzeb",
//                 "email": "razashahzaib119@gmail.com"
//             },
//             "userId": {
//                 "_id": "685f078c75ba6848f4b33bb2",
//                 "name": "reciever",
//                 "email": "testt123jk@gmail.com"
//             },
//             "requestId": {
//                 "_id": "685f130445ef9a1f90c8956a",
//                 "requestName": "Emergency Food and Shelter",
//                 "requestDescription": "Due to recent heavy rains, our house collapsed. We urgently need food supplies and temporary shelter for our family of five.",
//                 "location": "Nowshera, Khyber Pakhtunkhwa",
//                 "urgencyLevel": "High",
//                 "requestType": "Food",
//                 "deadline": "2025-07-05T00:00:00.000Z"
//             },
//             "requestStatus": "Confirmed",
//             "__v": 0
//         },
//         {
//             "_id": "6860cc6b8ae81e2a52b121a2",
//             "adminId": {
//                 "_id": "685cde296b09dc591904ddad",
//                 "name": "Shahzeb",
//                 "email": "razashahzaib119@gmail.com"
//             },
//             "userId": {
//                 "_id": "685f078c75ba6848f4b33bb2",
//                 "name": "reciever",
//                 "email": "testt123jk@gmail.com"
//             },
//             "requestId": {
//                 "_id": "6860bae299fc3bb1c9508694",
//                 "requestName": "Need of food",
//                 "requestDescription": "We are a family of three in the need of food! I would Appreaciate if we are helped by someone",
//                 "location": "Islamabad",
//                 "urgencyLevel": "High",
//                 "requestType": "Money",
//                 "deadline": "2025-10-15T00:00:00.000Z"
//             },
//             "requestStatus": "Confirmed",
//             "__v": 0
//         }
//     ]
// }


//Request/:requestId  Response
// {
//     "success": true,
//     "message": "Request details retrieved successfully",
//     "request": {
//         "requestId": "6860bae299fc3bb1c9508694",
//         "requestName": "Need of food",
//         "requestDescription": "We are a family of three in the need of food! I would Appreaciate if we are helped by someone",
//         "location": "Islamabad",
//         "urgencyLevel": "High",
//         "requestType": "Money",
//         "role": "Family",
//         "deadline": "2025-10-15T00:00:00.000Z",
//         "date": "2025-06-27T00:00:00.000Z",
//         "proofImage": "https://example.com/uploads/proof_image123.jpg",
//         "receiver": {
//             "id": "685f078c75ba6848f4b33bb2",
//             "name": "reciever",
//             "email": "testt123jk@gmail.com"
//         },
//         "adminApproval": {
//             "adminId": "685cde296b09dc591904ddad",
//             "adminName": "Shahzeb",
//             "adminEmail": "razashahzaib119@gmail.com",
//             "approvalStatus": "Confirmed"
//         }
//     }
// }