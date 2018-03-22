const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const User = require('./user');
const bcrypt = require('bcrypt');
const to = require('./to');
const cors = require('cors');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const corsOptions = {};

const server = express();
server.use(bodyParser.json());
server.use(
    session({
        secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
        resave: true,
        saveUninitialized: true,
    }),
);
server.use(cors());

const sendUserError = (err, res) => {
    res.status(STATUS_USER_ERROR);
    if (err && err.message) {
        res.json({
            message: err.message,
            stack: err.stack
        });
    } else {
        res.json({
            error: err
        });
    }
};


server.post('/log-in', async (req, res) => {
    const {
        username,
        password
    } = req.body;
    const [err, user] = await to(User.findOne({
        username
    }))

    if (err) {
        res.json({
            error: "Could not retrieve the user"
        })
        return;
    }
    if (!user) {
        res.json({
            error: "User was not found in the database"
        })
        return;
    }
    const hashPW = user.passwordHash   
    bcrypt.compare(password, hashPW, function(err, suc) {
        if (err) {
            res.json({
                error: "Something went wrong"
            })
            return;
        }
        if (suc === true) {
            req.username = user.username;
            res.json({
                success: true
            });
        } else {
            return res.json({
                error: "Passwords do not match"
            })
        }
    });

});



server.post('/users', (req, res) => {
    const {
        username,
        password
    } = req.body;

    bcrypt.hash(password, BCRYPT_COST, function(err, hash) {

        req.user = {
            username,
            passwordHash: hash
        }

        new User(req.user).save((err, user) => {
            if (err) {
                return res.send({
                    error: "Error saving the user"
                });
            }
            res.json({
                success: "user was saved",
                user
            })
        })
    })
});
server.get('/me', async (req, res) => {
   
    req.session.username = req.query.username
    const {
        username
    } = req.session;
    console.log(req.session, req.query.username);
    if (!username) {
        sendUserError('You are not logged in', res);
        return;
    }
    const [err, user] = await to(User.findOne({
        username: req.query.username
    }, ))
    if (err) {
        res.json({
            error: "Could not retrieve the user"
        })
        return;
    }
    if (!user) {
        res.json({
            error: "User was not found in the database"
        })
        return;
    }

    res.send({
        user: req.user,
        session: req.session
    });
})

module.exports = {
    server
};