const express = require('express')
const db = require('../data/db');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/', (req, res) => {
    const user = req.body;
    const hash = bcrypt.hashSync(user.userPassword, 14)
    user.userPassword = hash;

    db('users').insert(user).then(id => {
        db('users').where({id: ids[0]}).first().then(user => {
            res.status(201).json(user);
        })
    })
})

module.exports = router;