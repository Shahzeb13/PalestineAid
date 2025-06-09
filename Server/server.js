const express = require("express");
const app = express();
require('dotenv').config();
const login = require("./routes/login.js");
const cors = require('cors');
const cookieParser = require('cookie-parser');

const dbConnect = require('./config/DatabaseConnection.js')



app.use(express.json());
app.use(express.urlencoded({extended : true}))
const port = process.env.PORT || 4000;
app.use(cookieParser());
app.use(cors({credentials : true}));






app.use('/api/auth' , login)

app.get('/' , (req , res) => {
    res.send('<h2>Welcome to the Home</h2>')
})



app.use(express.static('public'))

app.listen(port , () => {
    console.log(`Server is listening on http://localhost:${port}`)
})


dbConnect();