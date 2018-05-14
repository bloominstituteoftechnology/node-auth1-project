const express = require('express');
const mongoose = require('mongoose');
const User = require('./User/User');
const session = require('express-session');

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
server.use(session({
    secret: 'ffdmfdmfdkfdfdgjfdjknfdnkjdfkjndsm'
}));

// Custom Middleware
function login (req, res, next){
    if (req.body.user === 'helloz' && req.body.password === 'austin') {
        next();
    } else {
        res.send('You shall not pass!')
    }
}

// Initial route
server.get('/', (req, res) => {
    res.send('api running');
})

// Register route
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

// Login route
server.post('/api/login', login, (req, res) => {
    const session = req.session;
    if (!session.viewCount) {
        viewCount = 0;
    } else {
        session.viewCount++;
        res.json({ viewCount: session.viewCount })
    }

    res.send(session);
})

server.post('/api/users', (req, res) => {

})

const port = 5000;
server.listen(port, () => console.log(`Connected on port: ${port}`))