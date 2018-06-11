const express = require('express');
const server = express();
const mongoose = require('mongoose');
const User = require('./auth/UserModel.js');
mongoose.connect('mongodb://localhost/usersdb').then(() => {
    console.log('\n*** Connected to db***\n');
});

// const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.status(200).json({api: "running!"});
});

server.post('/api/register', (req, res) => {
    User.create(req.body)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

server.listen(8001, () => {
    console.log('\n***API running on port 8001***\n');
});