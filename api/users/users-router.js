const express = require('express');
const router = express.Router();

const Users = require('./users-model');
const mw = require('../middleware/middleware');

router.get('/', mw.restricted, (req, res) =>{
    Users.find()
    .then((users) =>{
        res.status(200).json(users);
    })
    .catch((err) =>{
        res.status(500).send(err);
    })
});

module.exports = router;
