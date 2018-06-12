const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const User = require('./auth/UserModel');

mongoose.connect('mongodb://localhost/auth-i')
    .then(() => {
        console.log(`\n*** Connected to database ***\n`)
    })

const server = express();

const port = 5000;

const sessionOptions = {
    secret: 'Nobody tosses a dwarf!',
    cookie: {
        maxAge: 1000 * 60 * 60 // an hour
    },
    httpOnly: true,
    secure: false,
    resave: true,
    saveUninitialized: false,
    name: 'noname',
}

function protected(req, res, next) {
    if (req.session && req.session.username) {
        next();
    } else {
        res.status(401).json({ message: 'you shall not pass!!' });
    }
}

server.use(express.json());
server.use(session(sessionOptions));

server.get('/', (req, res) => {
    res.status(200).json({ api: "running..." })
})

server.post('/api/register', (req, res) => {
    User.create(req.body)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).json({ error: "There was a problem creating user", err })
        })
})

server.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    User
        .findOne({ username })
        .then(user => {
            if(user){
                user
                    .validatePassword(password)
                    .then(passwordMatches => {
                        if(passwordMatches) {
                            req.session.username = user.username;
                            res.status(200).json('Logged in')
                        } else {
                            res.status(401).json({ error: 'Invalid credentials' });
                        }
                    })
                    .catch(err => {
                        res.status(500).json({ error: 'Error comparing passwords', err })
                    })
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        })
        .catch(err => {
            res.status(500).json({ error: 'Error logging in' })
        })
})

server.listen(port, () => {
    console.log(`\n*** API running on port ${port} ***\n`)
})