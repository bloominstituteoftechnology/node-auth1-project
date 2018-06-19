const express = require('express');
const mongoose = require('mongoose');

const User = require('./auth/UserModel');

mongoose.connect('mongodb://localhost/auth-i').then(() => {
    console.log('\n*** Connected to database ***\n');
});

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.status(200).json({ api: 'running...'});
});

server.post('/api/register', (req, res) => {
    User.create(req.body)
    .then(user => {
        res.status(201).json({message: 'Logged In'});
    })
    .catch(err => {
        res.status(500).json(err)
    });
});

server.post('/api/login', (req, res)=> {
    const { username, password } = req.body;
    User.findOne({ username })
    .then(user => {
        if(user) {
           /*  bcrypt.compare(password, user.password).then(passwordsMatch => {
            }).catch(err => {
                res.send('error comparing passwords');
            }); */
        } else {
            res.status(400).send('You shall not pass!');
        }
    })
    .catch(err => {
        res.send(err);
    });
});

server.listen(8000, () => {
    console.log('\n*** API running on port 8000 ***\n');
});