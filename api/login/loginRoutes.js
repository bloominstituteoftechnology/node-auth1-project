const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../../data/db');

const router = express.Router();

router.post('/', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ errorMessage: "Please provide a username and password!" });
    const credentials = { username, password }
    db('users')
        .where('username', credentials.username).first()
        .then(response => {
            if (!response || !bcrypt.compareSync(credentials.password, response.password)) return res.status(401).json({ error: 'You shall not pass!' });
            return res.send('Logged in');
        })
        .catch(err => res.status(500).json({ error: "Couldn't save the user to the database." }))
})

module.exports = router;