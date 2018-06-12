const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const User = require('./authenticate/UserSchema');

mongoose.connect('mongodb://localhost/auth-i').then(() => {
    console.log('\n*** Connected to database ***\n');
});

const server = express();

const sessionOptions = {
    secret: 'Shhhh!',
    cookie: {
        maxAge: 1000 * 60 * 60
    },
    httpOnly: true,
    secure: false,
    resave: true,
    saveUninitialized: false,
    name: 'noname'
};

function protected(req, res, next) {
    if (req.session && req.session.username) {
        next();
    }
    else {
        res.status(401).json('You shall not pass!');
    }
}
server.use(express.json());
server.use(session(sessionOptions));

server.get('/', (req, res) => {
    if (req.session && req.session.username) {
        res.status(200).json(`Welcome back ${req.session.username}.`);
    }
    else {
        res.status(401).json('You must login to access resources.');
    }
});

server.get('/api/users', protected, (req, res) => {
    User.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(error => {
            res.status(500).json(error.message);
        })
});

server.post('/api/register', (req, res) => {
    User.create(req.body)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(error => {
            res.status(500).json(error.message);
        })
});

server.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username })
        .then(user => {
            if (user === null) {
                res.status(401).json('You shall not pass!');
            }
            else {
                user.isPasswordValid(password)
                    .then(isValid => {
                        if (isValid) {
                            req.session.username = user.username;
                            res.status(200).json('Logged In');
                        }
                        else {
                            res.status(401).json('You shall not pass!');
                        }
                    })
            }
        })
        .catch(error => {
            res.status(500).json('An error occurred while logging in.');
        })
});

server.get('/api/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(error => {
            if (error) {
                res.status(500).json(error.message);
            }
            else {
                res.status(200).json(`Good Bye!`)
            }
        })
    }
});

server.listen(61118, () => {
    console.log('\n*** API running on port 61118 ***\n');
}); 