const router = require('express').Router()

const Users = require('./users-model')

const restricted = require('../auth/middleware')
// const requiresAuth = require

router.get('/', restricted, (req, res) => {
    Users.find()
        .then(users => {
            res.json(users)
        })
        .catch(err => res.send(err))
})

module.exports = router