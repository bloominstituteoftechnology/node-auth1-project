const express = require('express');
const db = require('../data/db');
const router = express.Router();

router.post('/', (req, res) => {
    const authentication = req.body;
    
    db('users').where({username: authentication.username}).first().then(user => {
        if(!user || !bcrypt.compareSync(authentication.userPassword, users.userPassword)) {
            return res.status(401).json({ error: 'Incorrect password or username'})
        }
        db('users').where({ id: ids[0]}).first().then(user => {
            res.status(201).json(user);
        })
    })
})

module.exports = router