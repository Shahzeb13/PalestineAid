const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    name : { type : String  , required: true},
    email : { type : String  , required : true , unique : true},
    password : { type : String  , required : true},
    role : { type: String, enum: ['admin', 'donater', 'receiver'], required: true },
    isSuperAdmin : { type : Boolean, default: false },
    verifyOtp : { type : String  , default : ""},
    verifyOtpExpiresAt : { type : Date , default: null},
    isAccountVerified : { type : Boolean , default : false},
    resetOtp : {type : String , default : ""},
    resetOtpExpiresAt : {type : Date , default: null},
    stripeCustomerId : { type : String , default : null}
})

const user = mongoose.models.user  || mongoose.model('user' , userSchema );

module.exports = user;
