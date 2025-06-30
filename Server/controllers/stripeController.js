const { createDonationPaymentIntent, getPaymentDetails } = require('../config/stripe');
const donaterModel = require('../models/donaterModel');
const userModel = require('../models/userModel');
const adminDashboardModel = require('../models/adminModel');
const createTransporter = require("../config/nodeMailer.js")
const nodeMailer = require("nodemailer")


// Create payment intent for donor to admin payment
exports.createDonationPaymentIntent = async (req, res) => {
    try {
        const { userId } = req.body; // From middleware
        const { requestId, amount, currency = 'usd', message } = req.body;

        // Validate if user is a donater
        const donater = await userModel.findById(userId);
        if (!donater || donater.role !== "donater") {
            return res.status(403).json({
                success: false,
                message: "Only donaters can make donations"
            });
        }


        const donorEmail = donater.email; // the one who request for the stripe intent


        // Validate required fields
        if (!requestId || !amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Missing or invalid required fields: requestId, amount"
            });
        }

        // Check if request exists and is confirmed
        const adminEntry = await adminDashboardModel.findOne({
            requestId: requestId,
            requestStatus: "Confirmed"
        });

        if (!adminEntry) {
            return res.status(404).json({
                success: false,
                message: "Request not found or not confirmed"
            });
        }

        // Get request details for metadata
        const request = await adminDashboardModel.findById(requestId).populate('requestId');

        // Create payment intent with metadata
        const paymentIntent = await createDonationPaymentIntent(amount, currency, {
            donorId: userId,
            donorName: donater.name,
            donorEmail: donater.email,
            requestId: requestId,
            requestName: request?.requestId?.requestName || 'General Donation',
            adminId: adminEntry.adminId.toString(),
            message: message || "",
            donationType: 'donor_to_admin'
        });


        try {
            const mailOptions = {
              from: process.env.USER,
              to:donorEmail ,
              subject: "Welcome to PalestineAid!",
              html: `<!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>PalestineAid</title>
                  <style>
                      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
                      .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
                      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
                      .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
                      .content { padding: 40px 30px; line-height: 1.6; }
                      .message { background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 5px; }
                      .footer { background-color: #f8f9fa; padding: 20px 30px; text-align: center; color: #666; font-size: 14px; }
                      .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: 500; }
                  </style>
              </head>
              <body>
                  <div class="email-container">
                      <div class="header">
                          <h1>�� PalestineAid</h1>
                          <p>Connecting Hearts, Building Hope</p>
                      </div>
                      <div class="content">
                          <h2>Welcome to PalestineAid!</h2>
                          <p>Dear <strong>${user.name}</strong>,</p>
                          <div class="message">
                              <p>Your Stripe Donation intent has been created successfully: <strong>${donorEmail}</strong></p>
                              <p>Thank you for joining our community of hope and support.</p>
                          </div>
                          <p>You can now:</p>
                          <ul>
                              <li>Create aid requests if you're a receiver</li>
                              <li>Browse and donate to verified requests if you're a donater</li>
                              <li>Manage and approve requests if you're an admin</li>
                          </ul>
                          <a href="http://localhost:3000/login" class="button">Login to Your Account</a>
                      </div>
                      <div class="footer">
                          <p>© 2025 PalestineAid. All rights reserved.</p>
                          <p>This email was sent to ${donorEmail}</p>
                      </div>
                  </div>
              </body>
              </html>`
          };
            const transporter = await createTransporter();
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error('Email sending failed:', {
              message :emailError.message,
              stack : emailError.stack,
              body: req.body
            }
            );
  
            // Don't fail registration if email fails
        }
  
        return res.json({
            success: true,
            message: "Payment intent created successfully",
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            amount: amount,
            currency: currency
        });

    } catch (err) {
        console.error("Create donation payment intent error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to create payment intent"
        });
    }
};

// Confirm donation after payment (donor to admin)
exports.confirmDonation = async (req, res) => {
    try {
        const { userId } = req.body; // From middleware
        const { paymentIntentId, requestId, amount, currency, message } = req.body;

        // Validate if user is a donater
        const donater = await userModel.findById(userId);
        if (!donater || donater.role !== "donater") {
            return res.status(403).json({
                success: false,
                message: "Only donaters can confirm donations"
            });
        }

        const donorEmail = donater.email;

        // Validate required fields
        if (!paymentIntentId || !requestId || !amount || !currency) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: paymentIntentId, requestId, amount, currency"
            });
        }

        // Get payment details from Stripe
        const paymentDetails = await getPaymentDetails(paymentIntentId);
        
        if (paymentDetails.status !== 'succeeded' && process.env.NODE_ENV === 'production') {
            return res.status(400).json({
                success: false,
                message: "Payment not completed successfully"
            });
        }

        // Check if request exists and is confirmed
        const adminEntry = await adminDashboardModel.findOne({
            requestId: requestId,
            requestStatus: "Confirmed"
        });

        if (!adminEntry) {
            return res.status(404).json({
                success: false,
                message: "Request not found or not confirmed"
            });
        }

        // Create donation record (donor paid admin)
        const donation = new donaterModel({
            donaterId: userId,
            requestId: requestId,
            adminId: adminEntry.adminId,
            amount: amount,
            currency: currency,
            message: message || "",
            status: "Donated", // Donor successfully paid admin
            stripePaymentIntentId: paymentIntentId,
            paymentStatus: "completed", // Payment to admin completed
            adminPaymentStatus: "pending" // Admin hasn't paid NGO yet
        });

        await donation.save();
        try {
            const mailOptions = {
              from: process.env.USER,
              to:donorEmail ,
              subject: "Welcome to PalestineAid!",
              html: `<!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>PalestineAid</title>
                  <style>
                      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
                      .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
                      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
                      .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
                      .content { padding: 40px 30px; line-height: 1.6; }
                      .message { background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 5px; }
                      .footer { background-color: #f8f9fa; padding: 20px 30px; text-align: center; color: #666; font-size: 14px; }
                      .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: 500; }
                  </style>
              </head>
              <body>
                  <div class="email-container">
                      <div class="header">
                          <h1>�� PalestineAid</h1>
                          <p>Connecting Hearts, Building Hope</p>
                      </div>
                      <div class="content">
                          <h2>Welcome to PalestineAid!</h2>
                          <p>Dear <strong>${user.name}</strong>,</p>
                          <div class="message">
                              <p>Your Stripe Donation has been completed Successfully: <strong>${donorEmail}</strong></p>
                              <p>Thank you for joining our community of hope and support.</p>
                          </div>
                          <p>You can now:</p>
                          <ul>
                              <li>Create aid requests if you're a receiver</li>
                              <li>Browse and donate to verified requests if you're a donater</li>
                              <li>Manage and approve requests if you're an admin</li>
                          </ul>
                          <a href="http://localhost:3000/login" class="button">Login to Your Account</a>
                      </div>
                      <div class="footer">
                          <p>© 2025 PalestineAid. All rights reserved.</p>
                          <p>This email was sent to ${donorEmail}</p>
                      </div>
                  </div>
              </body>
              </html>`
          };
            const transporter = await createTransporter();
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error('Email sending failed:', {
              message :emailError.message,
              stack : emailError.stack,
              body: req.body
            }
            );
  
            // Don't fail registration if email fails
        }
  
     
        return res.json({
            success: true,
            message: "Donation to admin confirmed successfully",
            donation: {
                id: donation._id,
                amount: donation.amount,
                currency: donation.currency,
                status: donation.status,
                date: donation.date,
                paymentIntentId: donation.stripePaymentIntentId,
                adminPaymentStatus: donation.adminPaymentStatus
            }
        });

    } catch (err) {
        console.error("Confirm donation error:", {
            error: err.message,
            stack: err.stack,
            body: req.body,
            userId: req.body.userId,
            paymentIntentId: req.body.paymentIntentId,
            requestId: req.body.requestId
        });
        return res.status(500).json({
            success: false,
            message: "Failed to confirm donation",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

// Get payment details for admin dashboard
exports.getPaymentDetails = async (req, res) => {
    try {
        const { paymentIntentId } = req.params;

        if (!paymentIntentId) {
            return res.status(400).json({
                success: false,
                message: "Payment intent ID is required"
            });
        }

        const paymentDetails = await getPaymentDetails(paymentIntentId);

        return res.json({
            success: true,
            paymentStatus: paymentDetails.status,
            amount: paymentDetails.amount / 100, // Convert from cents
            currency: paymentDetails.currency,
            created: paymentDetails.created,
            metadata: paymentDetails.metadata,
            description: paymentDetails.description
        });

    } catch (err) {
        console.error("Get payment details error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to get payment details"
        });
    }
}; 