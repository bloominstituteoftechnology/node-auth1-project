const express = require('express')
const db = require('../data/dbConfig.js')
const route = express.Router()
const bcrypt = require('bcryptjs')
 
// Post route to create a new user
route.post('/', (req, res) => {
    // take in username and password, 
    //turn the password entered by the user 
    //into a hash then insert the username and the 
    //hashed password into the database.
    const creds = req.body
    const hash = bcrypt.hashSync(creds.password, 14)
    creds.password = hash
    db('users')
    .insert(creds)
    .then(ids => {
        res.status(201).json({Message: `Success added a new user with the ID of ${ids}`})
    })
    .catch(err => res.status(500).json({Message: `An error occurred: ${err}`}))
})

module.exports = route;