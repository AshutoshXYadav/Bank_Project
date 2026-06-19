const mongoose = require('mongoose');
const ledgerModel = require('./ledger.model');

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
        default: 'active'
    },

    currency: {
        type: String,
        required: [true, 'Currency is required'],
        default: 'INR'
    },
     system: {
    type: Boolean,
    default: false,
}
});

// Compound Index
AccountSchema.index({ User: 1, status: 1 });

AccountSchema.methods.getBalance = async function () {
    const balanceData = await ledgerModel.aggregate([
        {
            $match: {
                account: this._id
            }
        },
        {
            $group: {
                _id: null,
                totalDebit: {
                    $sum: {
                        $cond: [
                            { $eq: ['$type', 'debit'] },
                            '$amount',
                            0
                        ]
                    }
                },
                totalCredit: {
                    $sum: {
                        $cond: [
                            { $eq: ['$type', 'credit'] },
                            '$amount',
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                balance: {
                    $subtract: ['$totalCredit', '$totalDebit']
                }
            }
        }
    ]);

    if (balanceData.length === 0) {
        return 0;
    }

    return balanceData[0].balance;
};

const accountModel = mongoose.model('Account', AccountSchema);

module.exports = accountModel;