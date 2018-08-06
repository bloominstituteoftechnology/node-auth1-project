const express = require('express');
const db = require('../data/db');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.get('/', (req, res) => {
    db('users').then(user => {
        if(user.Logged) {
        res.status(200).json(user);
        } else {
            res.status(400).json({err: 'You shall not pass!'})
        }
    })
})

module.exports = router;