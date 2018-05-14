const express = require('express');
const mongoose = require('mongoose');

const User = require('./user/User');

mongoose
    .connect('mongodb://localhost/authprojdb')
    .then(go => {
        console.log('\n Connected to DB \n');
    })
    .catch(err => {
        console.log('\n MUST CONSTRUCT MORE PYLONS! \n', err);
    });

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send('API IS LIT FAM')
});

server.post('/api/register', function(req, res) {
    const user = new User(req.body);

    user
        .save()
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).send(err);
        });
})

// server.post('/login', function(req, res) {
//     .then()
//     .catch()
// })

// server.get('/user', function(req, res) {
//     .then()
//     .catch()
// })

server.listen(8000, () => console.log('Listening...'));