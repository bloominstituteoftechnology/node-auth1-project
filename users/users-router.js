const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');

const Users = require('./users-model');
const restricted = require('./users-middleware/restricted');

const router = express.Router();

router.use(helmet());
router.use(express.json());

router.get('/', (req, res) => {
    console.log('Username from users-router ', req.session.username)
    Users.find()
        .then(users => res.json(users))
        .catch(err => res.send(err))
})

module.exports = router;