const express = require('express')
const db = require('../data/dbConfig.js')
const route = express.Router()
const bcrypt = require('bcryptjs')

route.post('/', (req, res) => {
    const creds = req.body
    // if (creds != username && password) {
    //     res.status(401).json({Message: 'Must include both a username and a password'})
    // }
    const hash = bcrypt.hashSync(creds.password, 14)
    creds.password = hash
    db('users')
    .insert(creds)
    .then(ids => {
        res.status(201).json({Message: `Success added a new user with the ID of ${ids}`})
    })
    .catch(err => res.status(500).json(err))
})

module.exports = route;