const express = require('express');
const mongoose = require('mongoose');

const userRouter = require('./users/userRouter.js');

mongoose.connect('mongodb://localhost/authidb').then(() => {
    console.log('\n *** Connected to authidb database ***\n');
});

const server = express();

server.use(express.json());

server.use('/api', userRouter);

server.get('/', (req, res) => {
    res.status(200).json({ api: 'running...'});
});

const port = 8000;
server.listen(port, () => { console.log(`\n*** API running on port ${port} ***\n`)});