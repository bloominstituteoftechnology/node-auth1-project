const express = require('express');
const bcrypt = require('bcryptjs'); // adds hash library
const db = require('../database/dbConfig.js');

const router = express.Router();

// [POST] /api/register
// create account with username and password, fails if username already exists
router.post('/register', (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 14);
    creds.password = hash;

    db('users')
        .insert(creds)
        .then(id => {
            res.status(201).json({ id: id[0] });
        })
        .catch(err => {
            if (err.errno === 19) {
                res.status(500).json({ message: 'Username already exists' });
            } else {
                res.status(500).json({ message: 'Error creating new account' });
            }
        });
});

// [POST] /api/login
// user login, fails if username does not exist or password incorrect
router.post('/login', (req, res) => {
    const creds = req.body;

    db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(creds.password, user.password)) {
                req.session.userId = user.id;
                res.status(200).json({ message: 'Correct username and password, good job!' });
            } else {
                res.status(401).json({ message: 'Failed authentication, username does not exist or password is incorrect' });
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'Error occurred during login' });
        })
});

// [GET] /api/logout
// destroys session and logs out user
router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if(err) {
                res.status(500).json({ message: 'Error logging out' });
            } else {
                res.status(200).json({ message: 'Successfully logged out'})
            }
        })
    }
});

module.exports = router;