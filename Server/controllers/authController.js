const jwt = require("jsonwebtoken")
const bcryptjs = require("bcryptjs")
const userModel = require('../models/userModel.js')
const createTransporter = require("../config/nodeMailer.js")
const nodeMailer = require("nodemailer")
// ---------------------Register------------------------
exports.registerUser = async (req , res ) => {
   
    const { name , email , password } = req.body;


    if(!name || !email||  !password){
        res.status(400).json({success: false , message: "Missing required fields"});

    }


    try{
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(409).json({success: false , message : 'Email already Exists'});
        }
        const hashedPassword = await bcryptjs.hash(password , 10);
        const user = new userModel({name , email , password : hashedPassword})
        await user.save();

        const token = jwt.sign({id : user._id} , process.env.JWT_SECRET_KEY , {expiresIn : '1h'})
        if(!token){
            res.status(400).json({success: false , message : " Token Generation Failed"} )
        }
        res.cookie('token' , token , {
            httpOnly : true,
            maxAge : 3600000,
            secure : process.env.NODE_ENV === 'production',
            sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'strict'

        }
        )


        const mailOptions = {
            from : process.env.USER,
            to : email ,
            subject: "Welcome to PalestineAid!",
            text: `Your account has been created with the email id :${email}`
        }
        const transporter = await createTransporter();
        await transporter.sendMail(mailOptions);

        // console.log('Preview URL: %s', nodeMailer.getTestMessageUrl(info));


        return res.status(201).json({success: true , message: 'Registered Successfully'})
    }
    catch (err){
        return res.status(500).json({success: false , message : err.message})
    }
}


//----------------------------Login-----------------------------
exports.login = async (req , res) => {
     const {email , password} = req.body;
    // console.log(`Email : ${email} , Password : ${password}`)
     if(!email || !password){
        return res.status(400).json({success: false , message: 'Missing Email or Password'
        })
     }

     try{


        const user = await userModel.findOne({email});
        if(!user){
            return res.status(401).json({success: false , message : 'Email Not Found'})
        }



        const isMatched = await bcryptjs.compare(password, user.password);
        if(!isMatched){
           return res.status(401).json({success: false , message: "Wrong Password"});
        }




         const token = jwt.sign({id : user._id} , process.env.JWT_SECRET_KEY , {expiresIn : '1h'})

        res.cookie('token' , token , {
            httpOnly : true,
            maxAge : 3600000,
            secure : process.env.NODE_ENV === 'production',
            sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            path : "/"
        })

        return res.status(200).json({success : true , message : 'Login Successful'})
     }


 catch(err){
        return res.status(500).json({success: false , messsage: err.message})
     }
}



//--------------------Logout-----------------------------------
exports.logout = (req , res) => {

    try{
        res.clearCookie('token' , {
        httpOnly: true,
        secure : process.env.NODE_ENV === 'production',
        sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        path : "/"
    })

    return res.status(200).json({success:true  , message: 'Logout Successfuly'})
    }
    catch(err)
    {
        return res.status(500).json({success :false , message :err.message})
    }
    
}

//--------------------sendVerificationOtp-------------------------
exports.sendOtp = async (req, res) => {
  try{
        const { userId } = req.body;
        console.log('sendOtp called with userId:', userId);
        console.log('Full request body:', req.body);

  const user = await userModel.findById(userId);
  console.log('User found:', user ? 'Yes' : 'No');

  if(!user){
        console.log('User not found for userId:', userId);
        return res.status(404).json({success : false , message : "User Not Found"})
        } 

  if (user && user.isAccountVerified) {
    console.log('User already verified');
    return res.status(400).json({ message: 'User already verified.' });
  }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 60 * 1000); // 60 seconds
   
    console.log('Generated OTP:', otp);
    console.log('OTP expires at:', expiresAt);

    user.verifyOtp = otp;
    user.verifyOtpExpiresAt = expiresAt;
    await user.save();
    console.log('OTP saved to database');

    // For now, let's just log the OTP instead of sending email
    // This will help us test the functionality
    console.log('=== OTP FOR TESTING ===');
    console.log('Email would be sent to:', user.email);
    console.log('OTP Code:', otp);
    console.log('=======================');

    // Try to send email, but don't fail if email config is missing
    try {
        const mailOptions = {
            from : process.env.USER,
            to : user.email,
            subject: "Account Verification OTP",
            text: `Account Verification OTP :${otp}; `
        }

        const transporter = await createTransporter();
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (emailError) {
        console.error('Email sending failed:', emailError.message);
        console.log('But OTP is still generated and saved. Check console for OTP code.');
    }

   return res.status(200).json({success: true , message: "Otp Sent Successfully"});

   

  }
  catch(err) {
   console.error('sendOtp error:', err);
   return res.status(500).json({success: false , message : err.message});
  }
};



//------------------------------------verifyOTP---------------------------------------

exports.verifyOTP = async (req , res) => {
    const {userId , otp } = req.body;

   

    if(!userId || !otp){
        return res.status(400).json({success: false , message : "Missing Details"})
    }



    try{
        const user = await userModel.findById(userId);
        
        if(!user){
        return res.status(404).json({success : false , message : "User Not Found"})
        }

        if(user.verifyOtp !== otp){
        return res.status(400).json({success  : false , message : "Invalid OTP"})
        }

        if (new Date() > new Date(user.verifyOtpExpiresAt)) {
        return res.status(400).json({ message: "OTP has expired" });
        }


        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpiresAt = ""

        await user.save();

        return res.status(200).json({success : true , message: "User has been verified Successfully"});


}
    catch(err){
        res.status(500).json({success: false , message : err.message})
    }
  

  
}


// -----------------------IsAuthenticated------------------------------------

exports.isAuthenticated = async (req , res) => { 
try{
    return res.status(200).json({success: true})
}
catch(err){
    return res.status(500).json({success : true , message : err.message});
}



}

//-----------------------------------sentResetPasswordOtp---------------------------
exports.sentResetPasswordOtp = async (req ,res) => {


    const {email} = req.body;

    if(!email){
        return res.status(400).json({success: false , message : "Missing Email "})
    }

    try{
        


    const user = await userModel.findOne({email});

    if(!user){
        return res.status(404).json({success: false , message: "User Not Found"})
    }


        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
 // 5 minutes


        user.resetOtp = otp;
        user.resetOtpExpiresAt = expiresAt;


        await user.save();

        const transporter = await createTransporter();
        const mailOptions = {
            from : process.env.USER,
            to : user.email,
            subject : "Password Reset OTP",
            text: `Use this OTP to reset your password: ${otp}. It will expire in 5 minutes.`,
            }

            await transporter.sendMail(mailOptions);

            return res.status(200).json({success : true , message: "Otp sent Successfully"})
    }

    catch(err){
         return res.status(500).json({success : true , message : err.message});
    }
    
}



//...............................Reset password--------------------------------------
exports.resetPassword =async (req , res) => {

    const { otp , email , newPassword} = req.body;
    // console.log(`OTP : ${otp} | Email : ${email} | NewPassword : ${newPassword}`)
    if(!otp || !email || !newPassword){
        return res.status(400).json({success : false , message : "Required Field is missing"})
    }


    try{
        
    
    const user = await userModel.findOne({ email });

    if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" });
        }


        
        if (user.resetOtp = ""  || user.resetOtp !== otp) {
            return res.status(400).json({ success: false, message: "Incorrect OTP" });
        }


         if (user.resetOtpExpiresAt < new Date()) {
            return res.status(400).json({ success: false, message: "OTP has expired" });
        }
         const hashedPassword = await bcryptjs.hash(newPassword, 10);


          user.password = hashedPassword;
            user.resetOtp = "";
        user.resetOtpExpiresAt = 0;
        await user.save();

        return res.status(200).json({ success: true, message: "Password reset successfully" })
    }
    
    catch(err){
        return res.status(500).json({success : true , message : err.message});
    }
}

