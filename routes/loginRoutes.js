const express = require('express');
const router = express.Router();


const knex = require('knex');
const dbConfig = require('../knexfile');
const dbOne = knex(dbConfig.development);


const dbLogin = require('../data/userModel');

// router.post('/register', (req, res) => {
//     //hash password
//     //insert user with hashed password
//     //password must be at least 12 characters long
// })

// .post('/login', (req, res) => {
//     //post request to cross check username and then hashed passwords
// })

router.get('/users', (req, res) => {
    //return all users if logged in properly
    //else 'You shall not pass!'
    
    dbLogin.fetch()
        .then(users => {
            res.json(users)
        })
        .catch(err => {
            res.status(500).json({ message: "Unable to fetch users" })
        })
})

module.exports = router;