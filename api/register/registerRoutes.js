const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../../data/db');
const { postCheck } = require('../../middleware/required');

const router = express.Router();

router.post('/', postCheck, (req, res) => {
    const user = { username: req.username, password: req.password }
    const hash = bcrypt.hashSync(user.password, 14);
    user.password = hash;
    db('users')
        .insert(user)
        .then(response => res.status(201).json(response))
        .catch(err => res.status(500).json({ error: "Couldn't save the user to the database." }))
})

module.exports = router;