const express = require('express');
const mongoose = require('mongoose');

mongoose
.connect('mongodb://localhost/authN')
.then(connects => {
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

})

server.post('/api/login', (req, res) => {

})

const port = 5000;
server.listen(port, () => console.log(`Connected on port: ${port}`))