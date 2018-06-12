// const router = require('express').Router(); //declares that all routes for this address will be found on this router.
const express = require('express');
const router = express.Router();
const User = require('./UserModel');

// https://www.cheatography.com/kstep/cheat-sheets/http-status-codes/ 

router
    .route('/api/users')
    .get((req, res) => {
        User.find()
            .then(users => {
                res.json(users);
            })
            .catch(err => {
                res.status(500).json({err: 'You shall not pass!'});
            })
});

router
    .route('/api/register')
    .post((req, res) => {
    // traditional way of getting db info
    // const { username, password } = req.body;

    // save the user to the database
    User.create(req.body)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).json({err: 'Unable to save user.'});
        });
});

router
    .route('/api/login')
    .post((req, res) => {
        User.create(req.body)
            .then(user => {
                res.status(200).json(user)
            })
            .catch(err => {
                res.status(500).json({error: 'You shall not pass!'});
            })
    })

module.exports = router;