const mongoose = require("mongoose");
const accountModel = require("../models/Account.model");
const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const { v4: uuidv4 } = require("uuid");

const addInitialFundsController = async(req, res) => {
    try {
        const { _id, amount, description } = req.body;

        // Validate input
        if (!_id || !amount || amount <= 0) {
            return res.status(400).json({ 
                message: "Invalid input. Account ID and positive amount required." 
            });
        }

        // Find system account
        const systemAccount = await accountModel.findOne({ system: true }).select('+system');
        if (!systemAccount) {
            return res.status(400).json({ 
                message: "System Account does not exist" 
            });
        }

        // Find target account
        const targetAccount = await accountModel.findById(_id);
        if (!targetAccount) {
            return res.status(404).json({ 
                message: "Target Account not found" 
            });
        }

        // Create transaction from system to target account
        const transaction = await transactionModel.create({
            fromAccount: systemAccount._id,
            toAccount: targetAccount._id,
            status: 'completed',
            amount: amount,
            idempotencyKey: uuidv4()
        });

        // Create ledger entries
        // Debit from system account
        await ledgerModel.create({
            account: systemAccount._id,
            amount: amount,
            transaction: transaction._id,
            type: 'debit'
        });

        // Credit to target account
        await ledgerModel.create({
            account: targetAccount._id,
            amount: amount,
            transaction: transaction._id,
            type: 'credit'
        });

        res.status(200).json({ 
            message: "Funds added successfully",
            transaction: transaction,
            targetAccount: targetAccount._id
        });

    } catch (error) {
        console.error("Error adding funds:", error);
        res.status(500).json({ 
            message: "Error adding funds to account",
            error: error.message 
        });
    }
};

module.exports = addInitialFundsController;