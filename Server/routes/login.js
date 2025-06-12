const express = require("express");
const router = express.Router()
const {registerUser , login , logout , sendOtp ,verifyOTP , isAuthenticated ,sentResetPasswordOtp , resetPassword} = require('../controllers/authController.js')
const {authenticateUser} = require("../middlewares/authenticateUser.js")

router.post('/register' , registerUser)
router.post('/login' , login)
router.post('/logout' , logout)
router.post('/sendOTP' , authenticateUser , sendOtp )
router.post('/verifyOTP' ,    authenticateUser ,  verifyOTP)
router.post("/is-auth" ,authenticateUser , isAuthenticated )
router.post("/sendpassResetOTP" , sentResetPasswordOtp)
router.post("/resetPassword" , resetPassword)

module.exports = router;