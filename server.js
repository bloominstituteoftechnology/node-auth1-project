// npm add express mongoose
// npm install --sav-dev nodemon
// "main": "server.js",
// "scripts": {
//    "start": "nodemon server.js"
// yarn install
// yarn start

const express = require('express');
const mongoose = require('mongoose');

const User = require('./users/User');

mongoose
    .connect('mongodb://localhost/authdb')
    .then(conn => {
        console.log('\n=== Connected to Auth Mongo ===\n');
    })
    .catch(err => console.log('Error Connecting to Auth Mongo', err));

const server = express();

function authenticate(req, res, next) {
    if (req.body.password === 'kiwi') {
        next();
    } else {
        res.status(401).send('You shall not pass!');
    }
}

// server.use(greet);
server.use(express.json());

server.get('/api', (req, res) => {
    res.send({ route: 'Directing to', message: 'Fruit Farm' });
});

server.post('/api/register', function(req, res) {
    const user = new User(req.body);

    user
        .save()
        .then(user => res.status(201).send(user))
        .catch(err => res.status(500).send(err));
});

server.post('/api/login', authenticate, (req, res) => {
    res.send('Logged In');
});

server.get('/api/users', (req, res) => {
    bcrypt.
    if (req.body.password === 'kiwi') {
        next();
    } else {
        res.status(401).send('You shall not pass!');
    }
})

server.listen(5000, () => console.log('\n=== API Running on 5K ===\n'));
