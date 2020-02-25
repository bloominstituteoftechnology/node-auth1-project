const express = require('express');
const Users = require('./usersModel.js');
const bcrypt = require('bcryptjs');
const router = express();

router.post('/register', (req, res) => {
    const user = req.body;
    const hash = bcrypt.hashSync(user.password, 10);

    user.password = hash;
    Users.add(user)
        .then(saved => {
            res.status(201).json(saved);
        })
        .catch(error => {
            res.status(500).json({message: `Error registering new user: ${error}`});
        })
});

router.post('/login', (req, res) => {
    // On successful login, create a new session for the user
    const { username, password } = req.body;
    Users.findBy({ username })
        .then(user => {
            if(user && bcrypt.compareSync(password, user.password)){
                res.status(200).json({message: `Login successful.`});
            } else {
                res.status(401).json({message: `You shall not pass!`});
            }
        })
        .catch(error => {
            res.status(500).json({message: `Error login in user.`});
        })
});

router.post('/logout', (req, res) => {

});

module.exports = router;