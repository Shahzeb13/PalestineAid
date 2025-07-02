const jwt = require('jsonwebtoken');

exports.authenticateUser = (req, res, next) => {
    const token = req.cookies.token;
    
    console.log('Token from cookies:', token ? 'Present' : 'Missing');

    if (!token) {
        console.log('No token found in cookies');
        return res.status(401).json({ success: false, message: "No token Found!" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        console.log('Decoded token:', JSON.stringify(decodedToken, null, 2));
        // console.log('User ID from token:', decodedToken.id);
        const userRole = decodedToken.role;
        
        // Set user info in req.user for consistency
        req.user = { 
            id: decodedToken.id,
            role: userRole
        };
        
        // Also set userId in req.body for backward compatibility with OTP functions
        if (!req.body) req.body = {};
        req.body.userId = decodedToken.id;
        req.body.role = userRole;
        
        // console.log('Added userId to req.user:', req.user.id);
        // console.log('Added userId to req.body:', req.body.userId);
            
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};