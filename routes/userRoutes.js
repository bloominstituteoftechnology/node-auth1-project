const express = require('express')
const db = require('../data/dbConfig')
const route = express.Router()

route.get('/', (req, res) => {
    db('users')
    .select('id', 'username')
    .then(users => {
        console.log(users)
        res.status(200).json(users)
    })
    .catch(err => res.json(err))
})

module.exports = route;