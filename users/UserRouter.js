const express = require('express');
const router = express.Router();
const session = require('express-session');

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
//add session in order to save the data in the device.
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
                           req.session.username = user.username; //add session
                           res.send('Cookie for you') //check cookie
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

router
    .route('/logout')
    .get((req, res) => {
        if(req.session) {
            req.session.destroy(error => {  //req.session.destroy is a method in session.
                if(error) {
                    res.send('Logging Out Error')
                } else {
                    res.send('Hope to See You Soon')
                }
            })
        }
})

module.exports = router;