const mongoose = require("mongoose");

const donationIntentSchema = new mongoose.Schema({
    // Donation details
    amount: { type: Number, min: 0.01, required: true },
    currency: { type: String, enum: ["usd", "USD", "Pound", "Rupees"], default: "usd" },
    message: { type: String, maxLength: 500 },
    email: { type: String, required: true },
    
    // Status tracking
    status: { type: String, enum: ["pending", "completed", "expired"], default: "pending" },
    
    // User association (null until user registers/logs in)
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", default: null },
    
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) }, // 24 hours
    completedAt: { type: Date, default: null },
    
    // Conversion tracking
    convertedToDonation: { type: mongoose.Schema.Types.ObjectId, ref: "donaterDashboardModel", default: null }
}, {
    timestamps: true
});

// Indexes for better performance
donationIntentSchema.index({ email: 1, createdAt: -1 });
donationIntentSchema.index({ status: 1 });
donationIntentSchema.index({ expiresAt: 1 });
donationIntentSchema.index({ userId: 1 });

const donationIntentModel = mongoose.models.donationIntentModel || mongoose.model("donationIntentModel", donationIntentSchema);
module.exports = donationIntentModel; 