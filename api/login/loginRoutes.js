const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../../data/db');
const { postCheck } = require('../../middleware/required');

const router = express.Router();

router.post('/', postCheck, (req, res) => {
    const credentials = { username: req.username, password: req.password }
    db('users')
        .whereRaw('LOWER("username") = ?', credentials.username.toLowerCase()).first()
        .then(response => {
            if (!response || !bcrypt.compareSync(credentials.password, response.password)) return res.status(401).json({ error: 'You shall not pass!' });
            req.session.userId = response.id;
            return res.send('Logged in');
        })
        .catch(err => res.status(500).json({ error: "Couldn't save the user to the database." }))
})

module.exports = router;