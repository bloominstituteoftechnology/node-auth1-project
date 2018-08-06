const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../../data/db');

const router = express.Router();

router.post('/', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ errorMessage: "Please provide a name and password!" });
    const user = { username, password }
    const hash = bcrypt.hashSync(user.password, 14);
    user.password = hash;
    db('users')
        .insert(user)
        .then(response => res.status(201).json(response))
        .catch(err => res.status(500).json({ error: "Couldn't save the user to the database." }))
})

module.exports = router;