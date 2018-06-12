const express = require('express');

const mongoose = require('mongoose');


//connecting to mongo
mongoose
    .connect('mongodb://localhost/auth-i')
    .then(mongo => {
        console.log('connected to database');
    })
    .catch(err => {
        console.log('Error connecting to database', err)
    });

    //connected my userController file to server.
const userController = require('./users/userController.js'); 

const server = express();


server.use(express.json());

server.get('/', (req, res) => {
    res.status(200).json({ api: 'running' });
});

// server.use('/api/users', userModel);

server.listen(8000, () => {
    console.log('\n*** API running on port 8K ***\n');
});
