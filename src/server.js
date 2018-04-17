const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./user');
const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;
const server = express();
server.use(bodyParser.json());
server.use(
    session({
        secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
    })
);

server.post('/users', (req, res) => {
    const { username, password } = req.body;

    if (username && password) {
        bcrypt.hash(password, BCRYPT_COST, (err, hash) => {
            if (err) {
                res.status(STATUS_USER_ERROR).json(err);
            }
            const user = new User({ username, passHash: hash });
            user.save()
                .then((item) => {
                    res.status(200).json(item);
                })
                .catch((error) => {
                    res.status(STATUS_USER_ERROR).json(err);
                });
        });
    } else {
        res.status(STATUS_USER_ERROR).json('Username and Password Required.')
    }
});

server.post('/log-in', (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        User.findOne({ username })
            .then((item) => {
                item.checkPassword(password).then((response) => {
                    if (response) {
                        res.status(200).json(item);
                    } else {
                        res.status(STATUS_USER_ERROR).json('Incorrect Login Details');
                    }
                });
            })
            .catch((err) => {
                res.status(STATUS_USER_ERROR).json(err);
            });
    } else {
        res.status(STATUS_USER_ERROR).json('Username or Password Missing');
    }
});

const isLoggedIn = function (req, res, next) {
    const username = req.session.name;

    if (username) {
        User.findOne({ username })
            .then((item) => {
                req.user = item;
                next();
            });
    } else {
        return res.status(STATUS_USER_ERROR).json('Must be logged in')
    }
}

server.get('/me', isLoggedIn, (req, res) => {
    res.json(req.user);
});