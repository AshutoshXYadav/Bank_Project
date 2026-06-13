const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
        required: [true, 'User is required']
    },
    status: {
        type: String,
        enum: {
            values: ['active', 'inactive', 'pending'],
            message: 'Status must be either active, inactive or pending'
        },
        default: 'active'},
    currency: {
            type: String,
            required: [true,'Currency is required'],
            default:'INR'
        },
    balance:{
            type:Number,
            required:[true,'Balance is required'],
            default:0  
    }
});

AccountSchema.index({User:1}, {status:1});
const accountModel = mongoose.model('Account', AccountSchema);
module.exports = accountModel;