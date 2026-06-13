const express = require('express');
const router = express.Router();


const accountController = require('../controllers/accountController');
const authMiddleware = require('../../middlewares/auth.middleware');


router.post("/", authMiddleware, accountController.createAccount);


module.exports = router;