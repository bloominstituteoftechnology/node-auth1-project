const express = require('express')
const bcrypt = require('bcrypt')

const User = require('./User')

const router = express.Router()

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

router.post('/login', (req, res) => {
    const {username, password} = req.body
    User.findOne({username})
    .then((user) => {
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