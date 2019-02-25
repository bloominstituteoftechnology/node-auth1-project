// Package imports
const express = require('express');

// Local imports
const authConst = require('../data/helpers/authConst');
const db = require('../data/helpers/userDb');

// Router initialization
const router = express.Router();

// GET '/' - [Perms: USER] Gets the list of users in the database.
router.get('/', authorize(authConst.USER, (req, res) => {
    db.getList()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Unable to get users list.' });
        });
}));

// Router export for other files
module.exports = router;
