// Package imports
const express = require('express');

// Local imports
const authConst = require('../data/helpers/authConst');
const db = require('../data/helpers/userDb');

// Router initialization
const router = express.Router();

// GET '/' - [Perms: USER] Gets the list of users in the database.
router.get('/', (req, res) => {

});

// Router export for other files
module.exports = router;
