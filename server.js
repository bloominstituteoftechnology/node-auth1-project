const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const User = require('./userModel');

mongoose
    .connect('mongodb://localhost/auth-i')
    .then(() => { console.log('\n*** Connected to database ***\n'); })
    .catch(error => console.log('\n!!!Error connecting to DB!!!\n', error));

const server = express();

const sessionOptions = {
    secret: ' Space the final frontier ',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // a day
    },
    httpOnly: true,
    secure: false,
    resave: true,
    saveUninitialized: false,
    name: 'noname',
};

function protected(req, res, next) {
    if (req.session && req.session.username) {
        next();
    } else {
        res.status(401).json({ message: 'You shall not pass!' });
    }
};

server.use(express.json());
server.use(session(sessionOptions));

// server.get('/', (req, res) => {
//     res.status(201).json('Server Running')
// });

server.get('/', function (req, res) {
    if (req.session && req.session.username) {
        res.status(200).json({ message: `Welcome back ${req.session.username}` });
    } else {
        res.status(401).json({ message: 'Speak friend and enter' });
    }
});

// server.post('/api/register', (req, res) => {
//     User
//         .create(req.body)
//         .then(user => {
//             res.status(201).json(user);
//         })
//         .catch(err => {
//             res.status(500).json(err);
//         })
// })

server.post('/api/register', function (req, res) {
    User
        .create(req.body)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});


server.post('/api/login', function (req, res) {
    const { username, password } = req.body;
    User
        .findOne({ username })
        .then(user => {
            if (user) {
                user
                    .validatePassword(password)
                    .then(isValid => {
                        if (isValid) {
                            req.session.username = user.username;
                            res.send('Logged in');
                        } else {
                            res.status(401).send('You shall not pass!');
                        }
                    })
                    .catch(err => {
                        res.send('Error Comparing Passwords');
                    })
            } else {
                // If not found
                res.status(401).send('Invalid Credentials');
            }
        })
        .catch(err => res.status(500).json(err.message));
});

server.get('/api/users', protected, function (req, res) {
    User
        .find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => res.status(500).send('You shall not pass!'));
});


const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`\n*** API running on port ${port} ***\n`);
});