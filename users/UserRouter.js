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

// POST login 
//grab credential
//find the user to get access to the store password
//compare the password guess to the stored one from the model.
//if not found, give 'You shall NOT pass'.
router
    .route('/login')
    .post((req, res) => {
        const { username, password } = req.body;
        User
            .findOne({ username })
            .then(user => {
                if(user) {
                   user.validatePassword(password)
                   .then(matchedPwd => {
                       if(matchedPwd) {
                           res.send('Logged In Successfully')
                       } else {
                           res.send('You shall NOT pass!')
                       }
                   })
                   .catch(error => {
                       res.send('Comparing Password Error.')
                   })
                } else {
                    res.status(404).json('Invalid Credentials');
                }
            })
            .catch(error => {
                res.status(500).json(error)
            })
    })

module.exports = router;