const express = require('express');
const mongoose = require('mongoose');
const User = require('./User/User');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

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
    saveUninitialized: false,
    store: new MongoStore({
        url: 'mongodb://localhost/sessions',
        ttl: 60 * 10
    })
}

// Middleware
server.use(express.json());
server.use(session(sessionConfig))
server.use(restricted)

// Custom Middleware
function login (req, res, next){
    if (req.session && req.session.user) {
        next();
    } else {
        res.send('You shall not pass!')
    }
}

function restricted (req, res, next) {
    let path = req.path;

    if (path.includes('restricted')) {
        if (!req.session.user) {
            res.send('GET OUT')
        } else {
            next()
        }
    } else {
        next()
    }
}

// Initial route
server.get('/', (req, res) => {
    res.send('api running');
})

// Register route
server.post('/api/restricted/register', (req, res) => {

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

// View users when logged in
server.get('/api/restricted/users', login, (req, res) => {

    User
    .find()
    .then(users => {
        res.status(200).json({ users })
    })
    .catch(err => {
        res.status(500).send('You shall not pass!');
    })
})

// Logout route
server.get('/api/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(function(err) {
            if (err) {
                res.send('Error')
            } else {
                res.send('Goodbye')
            }
        });
    } 
});

const port = 5000;
server.listen(port, () => console.log(`Connected on port: ${port}`))