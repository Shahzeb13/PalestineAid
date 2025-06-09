const mongoose = require('mongoose');


const dbConnect = async () => {

    try{

        await mongoose.connect(`${process.env.MONGODB_URI}/authProject`);
        console.log("✅ MongoDB Connected");
    }

    catch (err) {
        console.log("❌ MongoDB Connection Error:", err);
    }
    
    
}

module.exports = dbConnect;