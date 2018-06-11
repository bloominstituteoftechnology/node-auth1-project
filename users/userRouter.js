const express = require('express');
const mongoose = require('mongoose');

const UserSchema = require('./userModel.js');

const router = express.Router();

router
    .route('/register')
        .post((req, res) => {
            UserSchema.create(req.body)
                .then(user => {
                    res.status(201).json(user);
                })
                .catch(err => {
                    res.status(500).json(err);
                })
        })

module.exports = router;