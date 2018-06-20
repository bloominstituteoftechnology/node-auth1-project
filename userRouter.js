const express = require('express')
const bcrypt = require('bcrypt')
const makeToken = require('./authFunction')

const server = express()

const User = require('./User')

const router = express.Router()

server.use(express.json())

const confirmAuth = (req, res, next) => {
    const {session} = req;
    if(session.isLoggedIn) {
        return next()
    } else {
        res.status(401).json({ msg: 'unauth'})
    }
}

router.get('/users', (req, res) => {
    User.find()
    .then((users) => {
        res.status(200).json(users)
    })
    .catch((error) => {
        res.status(500).json(error)
    })
})

router.post('/register', (req, res) => {
    const newUser = new User(req.body)
    .save()
    .then((user) => {
        res.status(201).json(user)
    })
    .catch((error) => {
        res.status(500).json(error)
    })
})

router.put('/login', (req, res) => {
    const {username, password} = req.body
    User.findOne({username})
    .populate()
    .then((user) => {
        const passCheck = bcrypt.compare(password, user.password)
        .then((passCheck) => {
            if(passCheck) {
                const token = makeToken(user)
                res.status(200).json({user, token})
            } else {
                res.status(500).json({error: 'login unsuccessful'})
            }
        })
    })
    .catch((error) => {
        res.status(500).json(error, "error")
    })
})

router.get('/protected', confirmAuth, (req, res) => {
    if (req.session.isLoggedIn === true) {
        res.status(200).json(req.session.user)
    } else {
        req.status(500).json({msg: 'error caused, no cleverness right meow'})
    }
})

module.exports = router