const express = require("express");
const router = express.Router();
const addInitialFundsController = require("../controllers/addInitialFundsController");
const systemAuthMiddleware = require("../../middlewares/systemAuth.middleware");

router.post("/system/addFunds", systemAuthMiddleware, addInitialFundsController);

module.exports = router;


