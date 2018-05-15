const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const session = require ('express-session');
const MongoStore = require('connect-mongo')(sesson);

const User = require('../users/User');

function authenticate(req, res, next) {
    if (req.session && req.session.username) {
        next();
    } else {
        res.status(401).send('You shall not pass!');
    }
};

const sessionConfig = {
    secret: 'nobody fights a dragon',
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000
    },
    httpOnly: true,
    secure: false,
    resave: true,
    saveUninitialized: false,
    name: 'noname',
    store: new MongoStore({
        url: 'mongodb://localhost/sessions',
        ttl: 60 * 10,
    })
};

router 
    .post('/', authenticate, (req, res) => {
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

module.exports = router;