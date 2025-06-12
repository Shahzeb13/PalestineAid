const express = require("express");
const userRouter = express.Router();
const {authenticateUser} = require("../middlewares/authenticateUser.js")
const {getUserData} = require("../controllers/userController.js");


userRouter.get("/data" , authenticateUser , getUserData);

module.exports = userRouter;
