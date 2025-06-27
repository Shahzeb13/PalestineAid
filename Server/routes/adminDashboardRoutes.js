const express  = require('express');
const adminDashboardRouter = express.Router();
const {getAllRequests} = require("../controllers/adminDashboardController")
const { authenticateUser } = require("../middlewares/authenticateUser.js");


adminDashboardRouter.get("/getRequestsList" , authenticateUser , getAllRequests);

module.exports = adminDashboardRouter