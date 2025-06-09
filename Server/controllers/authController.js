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
            return res.status(400).json({success: false , message : 'Email already Exists'});
        }
        const hashedPassword = await bcryptjs.hash(password , 10);
        const user = new userModel({name , email , password : hashedPassword})
        await user.save();

        const token = jwt.sign({id : user._id} , process.env.JWT_SECRET_KEY , {expiresIn : '1h'})

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
            sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'strict'

        })

        return res.status(200).json({success : true , message : 'Login Successful'})
     }


 catch(err){
        return res.status(500).json({success: false , messsage: err.message})
     }
}



//--------------------Logout-----------------------------------
exports.logout = (req , res) => {
    res.clearCookie('token' , {
        httpOnly: true,
        secure : process.env.NODE_ENV === 'production',
        sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    })

    return res.status(200).json({success:true  , message: 'Logout Successfull'})
}

//--------------------sendVerificationOpt-------------------------
exports.sendOtp = async (req, res) => {
  try{
        const { userId } = req.body;

//   if (!email) return res.status(400).json({ message: 'Email is required.' });

  const user = await userModel.findById(userId);

  if(!user){
        return res.status(404).json({success : false , message : "User Not Found"})
        } 

  if (user && user.isAccountVerified) {
    return res.status(400).json({ message: 'User already verified.' });
  }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes


    user.verifyOtp = otp;
    user.verifyOtpExpiresAt = expiresAt;
    await user.save();

    const mailOptions = {
        from : process.env.USER,
        to : user.email,
        subject: "Account Verification OTP",
        text: `Account Verification OPT :${otp}; `
    }



    await transporter.sendMail(mailOptions)


   return res.status(200).json({success: true , message: "Otp Sent Successfully"});

   

  }
  catch(err) {
   return res.status(500).json({success: false , message : err.message});
  }
};



//------------------------------------verifyEmail---------------------------------------

const verifyEmail = async (req , res) => {
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

        if (new Date() > new Date(user.verfiyOtpExpiresAt)) {
        return res.status(400).json({ message: "OTP has expired" });
        }


        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verfiyOtpExpiresAt = ""

        await user.save();

        return res.status(200).json({success : true , message: "Email has been verified Successfully"});


}
    catch(err){
        res.status(500).json({success: false , message : err.message})
    }
  

  
}