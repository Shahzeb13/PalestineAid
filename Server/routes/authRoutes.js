const express = require("express");
const { registerUser, login, logout, sendOtp, verifyOTP, isAuthenticated, sentResetPasswordOtp, resetPassword, createAdmin, createFirstSuperAdmin, checkSuperAdminExists } = require("../controllers/authController.js");
const { authenticateUser } = require("../middlewares/authenticateUser.js");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", login);
router.post("/logout", logout);
router.post("/send-reset-password-otp", sentResetPasswordOtp);
router.post("/reset-password", resetPassword);

// Protected routes (require authentication)
router.post("/send-otp", authenticateUser, sendOtp);
router.post("/verify-otp", authenticateUser, verifyOTP);
router.get("/is-auth", authenticateUser, isAuthenticated);

// Admin management routes
router.post("/create-admin", authenticateUser, createAdmin);
router.post("/create-first-super-admin", createFirstSuperAdmin);
router.get("/check-super-admin", checkSuperAdminExists);

module.exports = router;