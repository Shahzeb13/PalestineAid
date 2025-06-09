const express = require("express");
const router = express.Router()
const {registerUser , login , logout} = require('../controllers/authController.js')
const myLogger = (req , res , next) => {
    console.log('Logged');
    next();
}
router.use(myLogger) 

router.post('/register' , registerUser)
router.post('/login' , login)
router.post('/logout' , logout)

module.exports = router;