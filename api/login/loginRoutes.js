const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../../data/db');
const { postCheck } = require('../../middleware/required');

const router = express.Router();

router.post('/', postCheck, (req, res) => {
    const credentials = { username: req.username, password: req.password }
    db('users')
        .where('username', credentials.username).first()
        .then(response => {
            if (!response || !bcrypt.compareSync(credentials.password, response.password)) return res.status(401).json({ error: 'You shall not pass!' });
            return res.send('Logged in');
        })
        .catch(err => res.status(500).json({ error: "Couldn't save the user to the database." }))
})

module.exports = router;