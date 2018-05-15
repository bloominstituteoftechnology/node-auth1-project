// npm add express mongoose
// npm install --sav-dev nodemon
// "main": "server.js",
// "scripts": {
//    "start": "nodemon server.js"
// yarn install
// yarn start

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const User = require('./users/User');

mongoose
    .connect('mongodb://localhost/authdb')
    .then(conn => {
        console.log('\n=== Connected to Auth Mongo ===\n');
    })
    .catch(err => console.log('Error Connecting to Auth Mongo', err));

const server = express();

function authenticate(req, res, next) {
    if (req.session && req.session.username) {
        next();
    } else {
        res.status(401).send('You shall not pass!');
    }
}

// server.use(greet);

server.use(express.json());

server.get('/api', (req, res) => {
    if (req.session && req.session.username) {
      res.send(`Welcome Back ${req.session.username}`);
    } else {
      res.send( 'You shall not pass!');
    }
});

server.post('/api/register', function(req, res) {
    const user = new User(req.body);

    user
        .save()
        .then(user => res.status(201).send(user))
        .catch(err => res.status(500).send(err));
});

// server.post('/api/login', authenticate, (req, res) => {
//     res.send('Logged In');
// });

server.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username })
        .then(user => {
            if(user) { // Comparing Passwords
                user.isPasswordValid(password).then(isValid => {
                    if(isValid) {
                      req.sessions.username = user.username;
                      res.send('Have a Cookie');
                    } else {
                      res.status(401).send('You shall not pass!');
                    }
                });
            } else {
              res.status(401).send('You shall not user!');
            }
        })
        .catch(err => res.send(err));
});

server.post('/api/users', (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username })
        .then(user => {
            if (user) {
            // Compare the Passwords
            user.isPasswordValid(password).then(isValid => {
                if(isValid) {
                    res.send('Login Successful');
                } else {
                    res.status(401).send('You shall not pass!');
                }
            });
          } else {
            res.status(401).send('Invalid Credentials');
        }
    })
    .catch(err => res.send(err));
});

server.listen(5000, () => console.log('\n=== API Running on 5K ===\n'));
