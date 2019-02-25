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

});

// POST /login - The user is requesting to access other routes, and to 'create a session'. Returns 201 with { sessionKey: [data] }.
// req.body.email - The email of the user.
// req.body.password - The password of the user.
router.post('/login', (req, res) => {

});

// Router export for other files
module.exports = router;
