const express = require('express')
const db = require('../data/dbConfig')
const route = express.Router()

route.get('/', (req, res) => {
    if (req.session && req.session.username) {
        db('users')
        .select('id', 'username')
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => res.json(err))
    } else {
        res.status(401).send('You must log in to access this data.')
    }
})

module.exports = route;