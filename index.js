const express = require('express');

const db = require('./database/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send('We have liftoff!');
});

server.get('/users', (req, res) => {
    db('users')
    .then(users => {
        res.json(users);
    })
    .catch(err => res.send(err));
});

server.post('./register', function(req, res) {
    const user = req.body;

    db('users')
    .insert(user)
    .then(function(ids) {
        db('users')
        .where
    })
})