const express = require('express');
const router = express.Router();

const db = require('../data/userModel');

router.post('/register', (req, res) => {
    //hash password
    //insert user with hashed password
})

.post('/login', (req, res) => {
    //post request to cross check username and then hashed passwords
})

.get('/users', (req, res) => {
    //return all users if logged in properly
    //else 'You shall not pass!'
})

module.exports = router;