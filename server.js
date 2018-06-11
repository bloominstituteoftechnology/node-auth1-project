const express = require('express');
const mongoose = require('mongoose');

const User = require('./auth/UserModel');

mongoose.connect('mongodb://localhost/auth-i')
    .then(() => {
        console.log(`\n*** Connected to database ***\n`)
    })

const server = express();

const port = 5000;

server.use(express.json());

server.get('/', (req, res) => {
    res.status(200).json({ api: "running..." })
})

server.post('/api/register', (req, res) => {
    User.create(req.body)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).json({ error: "There was a problem creating user", err })
        })
})

server.listen(port, () => {
    console.log(`\n*** API running on port ${port} ***\n`)
})