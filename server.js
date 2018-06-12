const mongoose = require('mongoose');
const express = require('express');

const User = require('./Models/UserModel');

mongoose.connect('mongodb://localhost/auth').then(() => {
    console.log(`\n ************ Connected to DB ************* \n`);
});

const server = express();
server.use(express.json());

server.get('/', (req, res) => {
    res.status(200).json({ api: 'Running' });
});

server.post('/api/register', (req, res) => {
    User.create(req.body).then(user => {
        res.status(201).json(user);
    })
    .catch(error => {
        res.status(500).json({ error: error.message });
    });
});


server.listen(8000, () => {
    console.log(`\n ************ API Running on Port 8000 ************** \n`);
});