const express = require('express');
const mongoose = require('mongoose');

const User = require('./user/user');

mongoose.connect('mongodb://localhost/authProjectdb')
.then(conn => {
    console.log('\n== Connected to Database! ==\n')
})
.catch(err => {
    console.log('\n== Error connecting to database, sorry! ==\n')
})

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send('Connected')
});

server.post('/api/register', function(req, res) {
    const user = new User(req.body);

    user 
    .save()
    .then(user => {
        res.status(201).json({ user })
    })
    .catch(err => {
        res.status(500).send('Error creating, uh oh!');
    });
})

server.post('/login', function(req, res) {

    user
     .then()
     .catch()
})

server.get('/users', function(req, res) {
    // .then()
    // .catch()
})

server.listen(5000, () => console.log('Server running on port 5000'));