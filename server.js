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
      res.status(401).send( 'You shall not pass!' );
    }
}

// server.use(greet);

const sessionConfig = {
    secret: 'Amanda Secret',
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000,
    }, // 1 Day in milliseconds
    httpOnly: true,
    secure: false,
    resave: true,
    saveUninitialized: false,
    name: 'noname',
    store: new MongoStore ({
        url: 'mongodb://localhost/sessions',
        ttl: 60 * 10,
    }),
};

server.use(express.json());
server.use(session(sessionConfig));

server.get('/api', (req, res) => {
    if (req.session && req.session.username) {
      res.send(`Welcome Back ${req.session.username}`);
    } else {
      res.send( 'You shall not pass!' );
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
                      req.session.username = user.username;
                      res.send('Logged in');
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

server.get('/api/users', authenticate, (req, res) => {
    User.find().then(users => res.send(users));
});

server.get('/api/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(function(err) {
            if (err) {
                res.send('Error');
            } else {
                res.send('Good Bye');
            }
        });
    }
});

server.listen(5000, () => console.log('\n=== Amanda Running on 5K ===\n'));
