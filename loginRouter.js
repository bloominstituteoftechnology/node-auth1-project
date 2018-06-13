const express = require('express');
const router = require('express').Router()
const session = require('express-session');
const MongoStore = require('connect-mongo')(session)
const User = require('./users/User.js');


const server = express()
server.use(express.json())

server.use(session({ 
    secret: "ifIg1v3mYc4t3nuFScr1TCh3sM4yBeHEWIllL34vEMyN0t3s470N3",
    cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
    httpOnly: true,
    secure: false,
    saveUninitialized: false,
    resave: true,
    name: 'none',
    store: new MongoStore({
        url: 'mongodb://localhost/sessions',
        ttl: 60 * 10,
    }) // create a session for the server to use
}))


const sendUserError = (status, message, res) => {
    res.status(status).json({ error: message });
    return;
} // sendUserError


router.route('/').get((req, res, next) => {
    if (req.session && req.session.username) {
        res.send(`Welcome back ${req.session.username}`)
    } else {
        res.send(`Who are you?  Who?`)
    }
}) // If user is logged in, give them a message

router.route('/register').get((req, res) => {
    res.json("Please register to see content")
}) // If a client enters the register route, tell them to register

router.route('/register').post((req, res) => {
    User.create(req.body).then(user => {
        res.status(200).json(user)
    }).catch(err => res.status(500).json(err))
}) // if a client registers, create a new user with their information

router.route('/login').post((req, res) => {
    const { username, password } = req.body
        User.findOne({ username }).then(user => {
            if (user) {
                user.isPasswordValid(password).then(isValid => {
                    if (isValid) {
                        req.session.username = user.username;
                        res.status(200).send('Logged in')
                    } else {
                        res.status(401).send('You shall not pass!')
                    }
                }).catch(err => sendUserError(500, err.message, res))
            } else {
                sendUserError(401).send('You shall not pass!')
        }}).catch(err => sendUserError(500, err.message, res)
    )}) // find the username associated with the user making the login request.  If there is no user, do not allow login
    // If there is a username, call a function to compare the stored password with the plaintext password hashed

module.exports = router