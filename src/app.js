const express = require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.routes');
const accountRouter = require('./routes/account.routes');
const transactionRouter= require('./routes/transaction.routes');
const systemRouter = require('./routes/system.routes')

const app = express();
app.use(express.json());
app.use(cookieParser());




app.get('/', (req,res)=>{
    res.send('Hello World');            
});

app.use('/api/auth', authRouter);
app.use('/api/accounts',accountRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api',systemRouter);


module.exports = app;