const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth.middleware");
const { getAmount } = require("../controllers/getAmountController");

// GET balance for a specific account
// Route: GET /api/balance/:accountId
// Requires: JWT token in Authorization header or cookies
// Verifies: Token validity and account ownership
router.get("/:accountId", authMiddleware, getAmount);

module.exports = router;