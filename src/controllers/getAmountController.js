const Account = require('../models/Account.model');

// Get balance for an account with token verification and account ownership check
const getAmount = async (req, res) => {
    try {
        // req.user is attached by authMiddleware after token verification
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication failed. User not found' 
            });
        }

        // Get accountId from request params
        const { accountId } = req.params;

        if (!accountId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Account ID is required' 
            });
        }

        // Find the account
        const account = await Account.findById(accountId);

        if (!account) {
            return res.status(404).json({ 
                success: false, 
                message: 'Account not found' 
            });
        }

        // Verify that the account belongs to the logged-in user
        if (account.User.toString() !== req.user._id.toString()) {
            return res.status(403).json({ 
                success: false, 
                message: 'Unauthorized. This account does not belong to you' 
            });
        }

        // Get the balance using the account method
        const balance = await account.getBalance();

        return res.status(200).json({
            success: true,
            message: 'Balance retrieved successfully',
            accountId: accountId,
            balance: balance,
            currency: account.currency
        });

    } catch (error) {
        console.error('Error in getAmount:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error',
            error: error.message 
        });
    }
};

module.exports = { getAmount };