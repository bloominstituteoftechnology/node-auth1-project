const express = require('express');
const db = require('../data/db');
const session = require('express-session');
const router = express.Router();

function protected(req, res ,next) {
    if(req.session && req.session.userName) {
        next();
    } else {
        res.status(401).json({ message: 'You shall not pass'})
    }
}

router.get('/', protected, (req, res) => {
    db('users').then(user => {
        if(user) {
        res.status(200).json(user);
        } else {
            res.status(400).json({err: 'You shall not pass'})
        }
    })
})

module.exports = router;