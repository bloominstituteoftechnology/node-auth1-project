const express = require('express');
const mongoose = require('mongoose');
const User = require('./User/User');

mongoose
.connect('mongodb://localhost/authndb')
.then(connect => {
    console.log('You got connected');
})
.catch(err => {
    console.log('Can\'t connect');
})

const server = express();

// Middleware
server.use(express.json());

// Custom Middleware
function login (req, res, next){
    if (req.body.user === 'helloz' && req.body.password === 'austin') {
        res.send('Logged in')
        next();
    } else {
        res.send('You shall not pass!')
    }
}

// Initial route
server.get('/', (req, res) => {
    res.send('api running');
})

server.post('/api/register', (req, res) => {

    User
    .create(req.body)
    .then(user => {
        res.status(201).json({ user })
    })
    .catch(err => {
        res.status(500).send('Error Creating!')
    })
})

server.post('/api/login', login, (req, res) => {

    User
    .create(req.body)
    .then(login => {
        res.json(login)
    })
    .catch(err => {
        res.send('Not creating')
    })
    
})

server.post('/api/users', (req, res) => {

})

const port = 5000;
server.listen(port, () => console.log(`Connected on port: ${port}`))