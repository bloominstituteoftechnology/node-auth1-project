const express = require('express')
const db = require('../data/dbConfig')
const route = express.Router()

route.get('/', (req, res) => {
    console.log(req.session)
    if (req.session && req.session.username) {
        db('users')
        .select('id', 'username', 'password')
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => res.json(err))
    } else {
        res.status(401).send(console.log('Must log in to see to see this data.'))
    }
})

module.exports = route;