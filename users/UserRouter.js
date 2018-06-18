const express = require('express');
const router = express.Router();

const User = require('./userModel.js');

//start endpoints
router
    .route('/register')
    .post((req, res) => {
        User
            .create(req.body)
            .then(newUser => {
                res.status(201).json(newUser);
            })
            .catch(error => {
                res.status(500).json(error);
            });
    });

module.exports = router;