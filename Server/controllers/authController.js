const jwt = require("jsonwebtoken")
const bcryptjs = require("bcryptjs")
const userModel = require('../models/userModel.js')
const createTransporter = require("../config/nodeMailer.js")
const nodeMailer = require("nodemailer")

// Validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character (!@#$%^&*)");
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

const validateName = (name) => {
  const errors = [];
  
  if (name.length < 2) {
    errors.push("Name must be at least 2 characters long");
  }
  
  if (name.length > 50) {
    errors.push("Name must be less than 50 characters");
  }
  
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    errors.push("Name can only contain letters and spaces");
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

// ---------------------Register------------------------
exports.registerUser = async (req , res ) => {
   
    const { name , email , password, role = 'donater' } = req.body;

    // Check for missing fields
    if(!name || !email||  !password){
        return res.status(400).json({
            success: false, 
            message: "Missing required fields",
            errors: {
                name: !name ? "Name is required" : null,
                email: !email ? "Email is required" : null,
                password: !password ? "Password is required" : null
            }
        });
    }

    // Prevent admin registration through public API
    if (role === 'admin') {
        return res.status(403).json({
            success: false,
            message: "Admin registration not allowed through public API"
        });
    }

    try {
        // Validate name
        const nameValidation = validateName(name);
        if (!nameValidation.isValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid name format",
                errors: {
                    name: nameValidation.errors
                }
            });
        }

        // Validate email
        if (!validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
                errors: {
                    email: "Please enter a valid email address"
                }
            });
        }

        // Validate password
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                success: false,
                message: "Password does not meet requirements",
                errors: {
                    password: passwordValidation.errors
                }
            });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(409).json({
                success: false, 
                message: 'Email already exists',
                errors: {
                    email: "An account with this email already exists"
                }
            });
        }

        // Hash password
        const hashedPassword = await bcryptjs.hash(password , 10);
        const user = new userModel({name , email , password : hashedPassword, role})
        await user.save();

        // Generate JWT token
        const token = jwt.sign({id : user._id} , process.env.JWT_SECRET_KEY , {expiresIn : '1h'})
        if(!token){
            return res.status(400).json({
                success: false, 
                message : "Token Generation Failed"
            });
        }

        // Set cookie
        res.cookie('token' , token , {
            httpOnly : true,
            maxAge : 3600000,
            secure : process.env.NODE_ENV === 'production',
            sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });

        // Send welcome email
        try {
            const mailOptions = {
                from : process.env.USER,
                to : email ,
                subject: "Welcome to PalestineAid!",
                text: `Your account has been created successfully with the email: ${email}`
            }
            const transporter = await createTransporter();
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error('Email sending failed:', emailError.message);
            // Don't fail registration if email fails
        }

        return res.status(201).json({
            success: true, 
            message: 'Registered Successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (err){
        console.error('Registration error:', err);
        return res.status(500).json({
            success: false, 
            message : "Internal server error. Please try again."
        });
    }
}

// ---------------------Create Admin (Super Admin Only)------------------------
exports.createAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    const requestingUser = req.user; // From auth middleware

    // Check if requesting user is super admin
    if (!requestingUser.isSuperAdmin) {
        return res.status(403).json({
            success: false,
            message: "Only super admins can create admin accounts"
        });
    }

    // Check for missing fields
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields"
        });
    }

    try {
        // Validate inputs
        const nameValidation = validateName(name);
        if (!nameValidation.isValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid name format",
                errors: { name: nameValidation.errors }
            });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                success: false,
                message: "Password does not meet requirements"
            });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        // Hash password and create admin
        const hashedPassword = await bcryptjs.hash(password, 10);
        const admin = new userModel({
            name,
            email,
            password: hashedPassword,
            role: 'admin',
            isSuperAdmin: false
        });
        await admin.save();

        return res.status(201).json({
            success: true,
            message: "Admin created successfully",
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (err) {
        console.error('Admin creation error:', err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// ---------------------Create First Super Admin------------------------
exports.createFirstSuperAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    // Check for missing fields
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields"
        });
    }

    try {
        // Check if any super admin exists
        const existingSuperAdmin = await userModel.findOne({ isSuperAdmin: true });
        if (existingSuperAdmin) {
            return res.status(403).json({
                success: false,
                message: "Super admin already exists"
            });
        }

        // Validate inputs
        const nameValidation = validateName(name);
        if (!nameValidation.isValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid name format"
            });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                success: false,
                message: "Password does not meet requirements"
            });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        // Hash password and create super admin
        const hashedPassword = await bcryptjs.hash(password, 10);
        const superAdmin = new userModel({
            name,
            email,
            password: hashedPassword,
            role: 'admin',
            isSuperAdmin: true
        });
        await superAdmin.save();

        // Generate JWT token
        const token = jwt.sign({ id: superAdmin._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        
        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });

        return res.status(201).json({
            success: true,
            message: "Super admin created successfully",
            user: {
                id: superAdmin._id,
                name: superAdmin.name,
                email: superAdmin.email,
                role: superAdmin.role,
                isSuperAdmin: superAdmin.isSuperAdmin
            }
        });
    } catch (err) {
        console.error('Super admin creation error:', err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// ---------------------Check if Super Admin Exists------------------------
exports.checkSuperAdminExists = async (req, res) => {
    try {
        const superAdmin = await userModel.findOne({ isSuperAdmin: true });
        return res.status(200).json({
            success: true,
            exists: !!superAdmin
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

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

        return res.status(200).json({
            success : true , 
            message : 'Login Successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isSuperAdmin: user.isSuperAdmin
            }
        })
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
        // console.log('sendOtp called with userId:', userId);
        // console.log('Full request body:', req.body);

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
   

    user.verifyOtp = otp;
    user.verifyOtpExpiresAt = expiresAt;
    await user.save();
   

    // For now, let's just log the OTP instead of sending email
    // This will help us test the functionality
    

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
        user.verifyOtpExpiresAt = null;

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
    const user = await userModel.findById(req.user.id).select('-password');
    if (!user) {
        return res.status(401).json({success: false, message: "User not found"});
    }
    
    return res.status(200).json({
        success: true,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isSuperAdmin: user.isSuperAdmin
        }
    });
}
catch(err){
    return res.status(500).json({success : false , message : err.message});
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


        
        if (user.resetOtp === ""  || user.resetOtp !== otp) {
            return res.status(400).json({ success: false, message: "Incorrect OTP" });
        }


         if (user.resetOtpExpiresAt < new Date()) {
            return res.status(400).json({ success: false, message: "OTP has expired" });
        }
         const hashedPassword = await bcryptjs.hash(newPassword, 10);


          user.password = hashedPassword;
            user.resetOtp = "";
        user.resetOtpExpiresAt = null;
        await user.save();

        return res.status(200).json({ success: true, message: "Password reset successfully" })
    }
    
    catch(err){
        return res.status(500).json({success : true , message : err.message});
    }
}

