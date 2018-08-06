const express = require('express');
const db = require('../../data/db');
const { loginCheck } = require('../../middleware/required');

const router = express.Router();

router.get('/', loginCheck, (req, res) => {
    db('users')
        .then(response => res.status(200).json(response))
        .catch(err => res.status(500).json({ error: "Couldn't retrieve the users information" }));
})

module.exports = router;