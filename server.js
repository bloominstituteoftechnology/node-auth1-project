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
const sessionConfig = {
    secret: 'ffdmfdmfdkfdfdgjfdjknfdnkjdfkjndsm',
    cookie: { maxAge: 60 * 60 * 1000 },
    httpOnly: true,
    secure: false,
    resave: true,
    saveUninitialized: false
}

// Middleware
server.use(express.json());
server.use(session(sessionConfig))

// Custom Middleware
// function login (req, res, next){
//     if (req.body.user === 'helloz' && req.body.password === 'austin') {
//         next();
//     } else {
//         res.send('You shall not pass!')
//     }
// }

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
server.post('/api/login', (req, res) => {
    const { user, password } = req.body;

    User
    .findOne({ user })
    .then(user => {
        if (user) {
            user.isPasswordValid(password)
            .then(isValid => {
                if (isValid) {
                    req.session.user = user.user;
                    res.send('Logged in');
                } else {
                    res.send('Error')
                }
            })
        } else {
            res.send('invalid')
        }
    })
    .catch(err => {
        res.send('no user')
    })
})

server.get('/api/users', (req, res) => {

    User
    .find()
    .then(users => {
        res.status(200).json({ users })
    })
    .catch(err => {
        res.status(500).send('You shall not pass!');
    })
})

const port = 5000;
server.listen(port, () => console.log(`Connected on port: ${port}`))