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
    })
}))


const sendUserError = (status, message, res) => {
    res.status(status).json({ error: message });
    return;
}


router.route('/').get((req, res, next) => {
    if (req.session && req.session.username) {
        res.send(`Welcome back ${req.session.username}`)
    } else {
        res.send(`Who are you?  Who?`)
    }
})

router.route('/register').get((req, res) => {
    res.json("Please register to see content")
})

router.route('/register').post((req, res) => {
    User.create(req.body).then(user => {
        res.status(200).json(user)
    }).catch(err => res.status(500).json(err))
})

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
    )})

module.exports = router