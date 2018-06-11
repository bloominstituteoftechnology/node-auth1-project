const router = require('express').Router(); //declares that all routes for this address will be found on this router.
const User = require('./auth/UserModel');

// https://www.cheatography.com/kstep/cheat-sheets/http-status-codes/ 

router
    .route('/')
    .get((req, res) => {
    res.status(200).json({api: 'running...'})
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

