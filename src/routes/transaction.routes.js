const {Router}= require ('express');
const transactionRoutes = Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../../middlewares/auth.middleware');

transactionRoutes.post("/",authMiddleware, transactionController.createTransaction);







module.exports = transactionRoutes;


