const express = require('express')
const bcrypt = require('bcrypt')
const session = require('express-session')

const server = express()

const User = require('./User')

const router = express.Router()

server.use(express.json())
server.use(session({secret:`Gerbilinidus's secret cache`, name:"XerxesIsLame"  }))

const confirmAuth = (req, res, next) => {
    const {session} = req.session;
    if(session.isLoggedIn) {
        return next()
    } else {
        res.status(401).json({ msg: 'unauth'})
    }
    next()
}

router.get('/users', (req, res) => {
    console.log(req.session)
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

router.post('/login', confirmAuth, (req, res) => {
    console.log('req',req.session)
    const {username, password} = req.body
    User.findOne({username})
    .then((user) => {
        console.log(user)
        const passCheck = bcrypt.compare(password, user.password)
        .then((passCheck) => {
            if(passCheck) {
                res.status(200).json({response:'login successful'})
            } else {
                res.status(500).json({error: 'login unsuccessful'})
            }
        })
    })
    .catch((error) => {
        res.status(500).json(error, "error")
    })
})

module.exports = router