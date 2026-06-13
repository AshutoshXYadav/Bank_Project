const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const { sendRegistrationEmail } = require('../services/email.service');
require('dotenv').config();

const registerUser = async (req, res) =>{
    try{
        const {name, email, password} = req.body;
        const existingUser = await User.findOne({email});
        if(!existingUser){
            const newUser = new User({
                name,
                email,
                password
            });
            await newUser.save();
            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
            res.cookie('token', token, {httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000});
            res.status(201).json({message: "User registered successfully", token});

            await sendRegistrationEmail(email, name);
        }else{
            res.status(400).json({message: "Email already exists"});
        }       

    }catch(error){
        res.status(500).json({message: "Server error", error: error.message});
    }
}

module.exports = {
    registerUser
};