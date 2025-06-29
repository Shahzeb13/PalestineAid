const express  = require('express');
const adminDashboardRouter = express.Router();
const {getAllRequests , getSingleRequestDetails, approveUserRequest} = require("../controllers/adminDashboardController")
const { authenticateUser } = require("../middlewares/authenticateUser.js");


adminDashboardRouter.get("/getRequestsList" , authenticateUser , getAllRequests);
adminDashboardRouter.get("/getSingleRequestDetails/:requestId" ,authenticateUser , getSingleRequestDetails);
adminDashboardRouter.post("/approveRequest/:requestId" , authenticateUser , approveUserRequest);

module.exports = adminDashboardRouter