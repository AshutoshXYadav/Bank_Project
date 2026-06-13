const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationControler');
const loginController = require('../controllers/loginController');
require('dotenv').config();


router.post('/register', registrationController.registerUser);
router.post('/login',loginController.loginUser);













module.exports = router;