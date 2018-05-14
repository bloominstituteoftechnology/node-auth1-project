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

server.post('/api/login', (req, res) => {

})

const port = 5000;
server.listen(port, () => console.log(`Connected on port: ${port}`))