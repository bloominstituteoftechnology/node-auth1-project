const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require("connect-mongo")(session);

const Register = require('./register/register');
const User = require('./users/User');

mongoose 
    .connect('mongodb://localhost/authdb')
    .then(conn => {
        console.log('\n=== connected to mongo db ===\n');
    })
    .catch(err => console.log('error connecting to db', err));

function authenticate(req, res, next) {
    if (req.session && req.session.username) {
        next();
    } else {
        res.status(401).send('You shall not pass!');
    }
};

const sessionConfig = {
    secret: 'nobody tosses a dwarf!',
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000
    },
    httpOnly: true,
    secure: false,
    resave: true,
    saveUninitialized: false,
    name: "noname",
    store: new MongoStore({
        url: "mongodb://localhost/sessions",
        ttl: 60 * 10
    })
};

const server = express();

server.use(express.json());
server.use(session(sessionConfig));
server.use('/register', Register);

server.get('/', (req, res) => {
    res.send({ api: 'running' });
});

server.post('/login', authenticate, (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username })
        .then(user => {
            if (user) {
                user.isPasswordValid(password)
                    .then(isValid => {
                        if (isValid) {
                            req.session.username = user.username;
                            res.send('login successfull');
                        } else {
                            res.status(401).send('invalid password');
                        }
                    })
            } else {
                res.status(401).send('invalid username');
            }
        })
        .catch(err => res.send(err));
});

server.listen(5000, () => console.log(`\n=== api running on port 5000 ===\n`));