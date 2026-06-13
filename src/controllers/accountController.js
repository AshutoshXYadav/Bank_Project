const Account = require('../models/Account.model');

const createAccount = async(req , res)=>{
    try{
        const userID = req.user.id;
        const existingAccount = await Account.findOne({User: userID});
        
        const account = await Account.create({
            User : userID 

        })
        res.json({ account });
            
        
    }
    catch(error){
        console.error('Error creating account:', error);
        res.status(500).json({message: 'Internal Server Error'});
    } 
}
module.exports = {createAccount};