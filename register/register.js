const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const User = require('../users/User');

router 
    route('/')
    .post((req, res) => {
        const user = new User(req.body);

        user
        .save()
        .then(user => res.status(201).send(user))
        .catch(err => res.status(500).send(err));
    });

export default router;
