const express = require('express');
const db = require('../database/dbConfig.js');

const router = express.Router();

// [GET] /api/restricted/test
// test restricted global middleware
router.get('/test', (req, res) => {
    res.send('You must be logged in since you can see me!')
});

// [GET] /api/restricted/users
// return all usernames with id
router.get('/users', (req, res) => {
    db('users')
        .select('id', 'username')
        .then(users => {
            if (users.length) {
                res.status(200).json(users);
            } else {
                res.status(200).json({ message: 'No users in database' })
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'Error retrieving users ' });
        });
});

module.exports = router;