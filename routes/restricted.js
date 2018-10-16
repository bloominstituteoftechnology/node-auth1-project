const express = require('express');
const router = express.Router();

const knex = require('knex');
const knexConfig = require('../knexfile.js');
const db = knex(knexConfig.development);

router.get('/users', (request, response) => {
    db('users')
        .select('id', 'username', 'password')
        .then(users => {
            return response
                .json(users);
        })
        .catch(() => {
            return response
                .status(500)
                .json({ Error: "Could not find list of users." });
        })
});

module.exports = router;