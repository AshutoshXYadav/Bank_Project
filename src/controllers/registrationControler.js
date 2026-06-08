const User = require('../models/User.model');
const { sendRegistrationEmail } = require('../services/email.service');

registerUser = async (req, res) =>{
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
            res.status(201).json({message: "User registered successfully"});

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