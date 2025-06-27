const express = require("express");
const recieverDashboardRouter = express.Router();
const {handleRecieverRequest , getRecieverDashboardData , updateRequest , deleteRequest , getSingleRequestData} = require("../controllers/recieverRequestController")
const { authenticateUser } = require("../middlewares/authenticateUser.js");


recieverDashboardRouter.post("/sendAidRequest", authenticateUser, handleRecieverRequest);
recieverDashboardRouter.get("/getRecieverDashboardData/:id", authenticateUser, getRecieverDashboardData);
recieverDashboardRouter.put("/updateRequest/:requestId", authenticateUser, updateRequest);
recieverDashboardRouter.delete("/deleteRequest/:requestId", authenticateUser, deleteRequest);
recieverDashboardRouter.get("/getSingleRequestData/:requestId", authenticateUser, getSingleRequestData);
module.exports = recieverDashboardRouter;