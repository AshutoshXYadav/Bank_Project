const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../src/models/User.model');

const authMiddleware = async(req, res, next) =>{
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({message:'Unauthorized'});
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if(!user){
            return res.status(401).json({message:'Unauthorized token '});
        }
        req.user = user;
        next();
    }
    catch(err){
        return res.status(401).json({message:'Token is not valid'});
    }
}
module.exports = authMiddleware;
