const express = require('express');
const db = require('../data/db');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const router = express.Router();


router.post('/', (req, res) => {
    const authentication = req.body;
    
    db('users').where({userName: authentication.userName}).first().then(user => {
        
        if(user && bcrypt.compareSync(authentication.userPassword, user.userPassword)) {
             req.session.userName = user.userName
             res.status(200).send(`Welcome ${user.userName}`);
        } else {
            return res.status(401).json({ error: 'Username or password is incorrect'})
        }
    }).catch(err => {
        res.status(500).json(err);
    })
})

module.exports = router