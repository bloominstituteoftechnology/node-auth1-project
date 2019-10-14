const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');

const db = require('../data/db-config');
const Users = require('./users-model');

const router = express.Router();

router.use(helmet());
router.use(express.json());

router.post('/register', (req, res) => {
    let user = req.body;

    if (user) {
        const hash = bcrypt.hashSync(user.password, 8);
        user.password = hash;

        Users.add(user)
            .then(newUser => res.status(201).json(newUser))
            .catch(err => res.status(500).json(err))
    } else {
        res.status(400).json({ message: 'Please provide a valid username and password' })
    }
})

module.exports = router;