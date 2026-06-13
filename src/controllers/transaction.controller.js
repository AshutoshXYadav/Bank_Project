const transactionModel = require('../models/Transaction.model');
const ledgerModel = require('../models/Ledger.model');
const emailService = require('../services/email.service');
const accountModel = require('../models/Account.model');
const mongoose = require('mongoose');

/**
 * validate Request
 * validate idempotency key
 * check account status
 * derive sender balance from ledger
 * create transaction
 * create debit ledger entry
 * create credit ledger entry
 * mark transaction as completed
 * commit mongodb session
 * send email notification to sender and receiver
 */

async function createTransaction(req, res){
    const {fromAccount, toAccount, amount , idempotencyKey} = req.body;
    
    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({message:'All fields are required'});   
    }
    const fromUserAccount = await accountModel.findOne({_id: fromAccount});
    if(!fromUserAccount){
        return response.json( message:"Account not found");

    }
    const toUserAccount = await accountModel.findOne({__id: toAccount}  );  
    if( !fromUserAccount || !toUserAccount)   {
        return res.status(400).json({
            message: "Invalid Sender or receiver Address";
        })
    }
    /**
     *2) check idempotency
     */

}
module.exports = {
    createTransaction  
}
