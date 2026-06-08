const User = require('../models/User.model');

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
        res.status(200).json({message:"='Login Successful'"});
    }
    catch(error){
        console.error('Error during login:',error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

module.exports = {loginUser};