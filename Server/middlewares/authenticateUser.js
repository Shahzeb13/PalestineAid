const jwt = require('jsonwebtoken');


exports.authenticateUser = (req , res , next) => {

    const token = req.cookies.token;
    // console.log(`token : ${token}`)

    if(!token){
        return res.status(401).json({ success : false , message: "No token Found!"});

    }




    try {
        const decodedToken  = jwt.verify(token  , process.env.JWT_SECRET_KEY);
        
// console.log('decoded token:', JSON.stringify(decodedToken, null, 2));

            req.body.userId = decodedToken.id;
            
            next();
       
    }

    catch(err){
        return res.status(500).json({success: false , message : err.message})    }



}