const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    name : { type : String  , required: true},
    email : { type : String  , required : true , unique : true},
    password : { type : String  , required : true},
    verifyOtp : { type : String  , default : ""},
    verifyOtpExpiresAt : { type : String , default : 0},
    isAccountVerified : { type : Boolean , default : false},
    resetOtp : {type : String , default : ""},
    resetOtpExpiresAt : {type : String , default : 0}
})

const user = mongoose.models.user  || mongoose.model('user' , userSchema );

module.exports = user;
