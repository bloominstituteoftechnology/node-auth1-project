// Package imports
const express = require('express');

// Local imports
const db = require('../data/helpers/authDb');

// Router initialization
const router = express.Router();

// POST /register - The user is requesting to create a new account. Returns 201.
// req.body.email - The email that the user is using.
// req.body.username - The username that the user is requesting.
// req.body.password - The password of the new user.
router.post('/register', (req, res) => {
    if (!req.body || !req.body.email || !req.body.username || !req.body.password) {
        res.status(400).json({ error: 'Must include email, username, and password in body' });
        return;
    }

    db.register(req.body.email , req.body.username, req.body.password)
        .then(_ => {
            res.status(201).end();
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Unable to register an account' });
        });
});

// POST /login - The user is requesting to access other routes, and to 'create a session'. Returns 201 with { sessionKey: [data] }.
// req.body.email - The email of the user.
// req.body.password - The password of the user.
router.post('/login', (req, res) => {
    if (!req.body || !req.body.email || !req.body.password) {
        res.status(400).json({ error: 'Must include email and password in body' });
        return;
    }

    db.login(req.body.email, req.body.password)
        .then(sessionKey => {
            res.status(201).json({ sessionKey: sessionKey });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Unable to login' });
        });
});

// Router export for other files
module.exports = router;
