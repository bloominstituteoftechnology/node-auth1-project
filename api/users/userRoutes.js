const express = require('express');
const db = require('../../data/db');

const router = express.Router();

router.get('/', (req, res) => {
    if (!req.session.userId) return res.status(401).json({ errorMessage: "You shall not pass!" });
    db('users')
        .then(response => res.status(200).json(response))
        .catch(err => res.status(500).json({ error: "Couldn't retrieve the users information" }));
})

module.exports = router;