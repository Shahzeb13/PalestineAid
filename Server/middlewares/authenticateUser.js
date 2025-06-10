const jwt = require('jsonwebtoken');


exports.authenticateUser = (req , res , next) => {

    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({ success : false , message: "No token Found!"});

    }




    try {
        const decodedToken  = jwt.verify(token  , process.env.JWT_SECRET_KEY);
    
            req.userId = decodedToken.id;
            next();
       
    }

    catch(err){
        return res.status(500).json({success: false , message : err.message})    }



}