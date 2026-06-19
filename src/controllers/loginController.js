const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const blackListModel = require('../models/blackList.model');

const loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;

        const existingUser = await User.findOne({email}).select('+password');

        if(!existingUser){
            return res.status(404).json({message: 'User not found'});

        }
        const isPasswordValid = await existingUser.comparePassword(password);
        if(!isPasswordValid){
            return res.status(401).json({message:"Username or password is incorrect"});
        }
        const token = jwt.sign({id: existingUser._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.cookie('token', token, {httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000});
        res.status(200).json({message:"Login Successful", token});
    }
    catch(error){
        console.error('Error during login:',error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

const logoutUser= async( req, res )=>{
    const token = req.cookie.token || req.headers.authorisation;
    if (!token){
        res.body({
            message: "Token not found !!"
        })
    }
    res.cookie(token, "");
  
    await blackListModel.create({
        token:{
            token
        }
    })
    return res.status(200).json({
        message:"Account Logged Out Sucessfully"
    })
}
module.exports = {loginUser, logoutUser};