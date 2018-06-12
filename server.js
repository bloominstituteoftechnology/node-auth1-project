const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const User = require('./user/userModel')

const server = express()

mongoose.connect('mongodb://localhost/user').then(() => {
    console.log('connected to database')
})

const sessionOptions = {
    secret: 'nobody tosses a dwarf!',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    },
    httpOnly: true,
    secure: false,
    resave: true,
    saveUninitialized: false,
    name: 'noname'
}

server.use(express.json())
server.use(session(sessionOptions))

server.get('/', (req, res) => {
    res.status(200).json({ api: "api running..." })
})

server.post('/api/register', (req, res) => {
    const newUser = { username, password } = req.body
    User.create(newUser)
        .then( user => res.status(201).json(user) )
        .catch( err => res.status(500).json({ error: err.message }))
})

server.post('/api/login', (req, res) => {
    const { username, password } = req.body
    User.findOne({ username })
        .then( foundUser => {
            if (foundUser) {
                foundUser.isPasswordValid(password)
                    .then( valid => {
                        if (valid) {
                            req.session.username = foundUser.username;
                            res.send('cookie sent')
                        } else {
                            res.status(401).json({ 
                                userError: 'username or password is incorrect'
                            })
                        }
                    })
                    .catch( err => {
                        res.status(500).json({
                            error: 'error processing credentials'
                        })
                    })
            } else {
                res.status(401).json({ 
                    userError: 'username or password is incorrect'
                })
            }
        })
        .catch( err => {
            res.status(500).json({
                error: 'error retrieving user'
            })
        })
})

server.get('/api/users', (req, res) => {
    if (req.session && req.session.username) {
        User.find()
            .then( users => res.status(200).json( users ))
            .catch( err => res.status(500).json({ error: err.message }))
    } else {
        res.status(401).json({ userError: 'not logged in' })
    }
})

server.get('/api/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).json({ error: 'error logging out' })
            } else {
                res.status(200).json({ message: 'successfully logged out' })
            }
        })
    }
})

server.listen(5000, () => {
    console.log('api running on port 5000')
})