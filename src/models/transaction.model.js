const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({

fromAccount:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: [true, 'From Account is required']
},
toAccount:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: [true, 'To Account is required']
},
status:{
    type: String,
    enum:{
        values: ['pending', 'completed', 'failed','reversed'],
        message: 'Status must be either pending, completed,reversed or failed'
    }
},
amount:{
    type: Number,
    required: [true, 'Amount is required']},

    idempotencyKey: {
        type: String,
        required: [true, 'Idempotency Key is required'],
        unique: true
    }
}, { timestamps: true });       

const transactionModel = mongoose.model('Transaction', TransactionSchema);
module.exports = transactionModel;