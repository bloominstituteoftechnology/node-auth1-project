const express = require('express');
const mongoose = require('mongoose');

const User = require('./auth/UserModel');

mongoose.connect('mongodb://localhost/auth-i')
    .then(
        () => {
            console.log('\n*** Connected to Database***\,');
    })

const app = express();

app.use(express.json());

app
    .get('/', (req, res) => {
        res.status(200).json({ api: 'running' });
    })

app
    .post('/api/register', (req, res) => {
        User.create(req.body)
            .then(user => {
                res.status(201).json(user);
            })
            .catch(error => {
                res.status(500).json(error);
            });
    })

port = 5001;

app.listen(port, () => {
    console.log(`API running on port ${port}`);
});