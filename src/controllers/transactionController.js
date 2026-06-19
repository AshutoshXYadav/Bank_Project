const transactionModel = require('../models/transaction.model');
const ledgerModel = require('../models/ledger.model');
const emailService = require('../services/email.service');
const accountModel = require('../models/Account.model');
const mongoose = require('mongoose');

async function createTransaction(req, res) {
    const session = await mongoose.startSession();

    try {
        const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

        // Validate Request
        if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        // Validate Accounts
        const fromUserAccount = await accountModel.findById(fromAccount);
        const toUserAccount = await accountModel.findById(toAccount);

        if (!fromUserAccount || !toUserAccount) {
            return res.status(404).json({
                message: 'Invalid sender or receiver account'
            });
        }
        // Verify account ownership - user can only send from their own account
        if (fromUserAccount.User.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: 'Forbidden - You can only send from your own account'
            });
        }

        // Check Idempotency
        const existingTransaction = await transactionModel.findOne({
            idempotencyKey
        });

        if (existingTransaction) {
            switch (existingTransaction.status.toLowerCase()) {
                case 'completed':
                    return res.status(200).json({
                        message: 'Transaction already processed',
                        transaction: existingTransaction
                    });

                case 'pending':
                    return res.status(202).json({
                        message: 'Transaction is pending',
                        transaction: existingTransaction
                    });

                case 'failed':
                    return res.status(400).json({
                        message: 'Transaction failed',
                        transaction: existingTransaction
                    });

                case 'reversed':
                    return res.status(400).json({
                        message: 'Transaction reversed. Retry transaction.',
                        transaction: existingTransaction
                    });
            }
        }

        // Check Account Status
        if (
            fromUserAccount.status !== 'active' ||
            toUserAccount.status !== 'active'
        ) {
            return res.status(400).json({
                message: 'One or both accounts are inactive'
            });
        }

        // Check Balance
        const balance = await fromUserAccount.getBalance();

        if (balance < amount) {
            return res.status(400).json({
                message: 'Insufficient balance'
            });
        }

        // Start Transaction
        session.startTransaction();

        // Create Transaction Record
        const transaction = await transactionModel.create(
            [
                {
                    fromAccount,
                    toAccount,
                    amount,
                    idempotencyKey,
                    status: 'pending'
                }
            ],
            { session }
        );

        const transactionDoc = transaction[0];

        // Debit Sender
        await ledgerModel.create(
            [
                {
                    account: fromAccount,
                    amount,
                    transaction: transactionDoc._id,
                    type: 'debit'
                }
            ],
            { session }
        );

        // Credit Receiver
        await ledgerModel.create(
            [
                {
                    account: toAccount,
                    amount,
                    transaction: transactionDoc._id,
                    type: 'credit'
                }
            ],
            { session }
        );

        // Mark Completed
        transactionDoc.status = 'completed';
        await transactionDoc.save({ session });

        // Commit Transaction
        await session.commitTransaction();

        // Send Emails
        try {
            await emailService.sendTransactionEmail(
                fromUserAccount,
                toUserAccount,
                amount,
                transactionDoc
            );
        } catch (emailError) {
            console.error('Email Error:', emailError.message);
        }

        return res.status(201).json({
            success: true,
            message: 'Transaction completed successfully',
            transaction: transactionDoc
        });
    } catch (error) {
        await session.abortTransaction();

        console.error(error);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    } finally {
        session.endSession();
    }
}

module.exports = {
    createTransaction
}; 