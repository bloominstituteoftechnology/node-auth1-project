const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

const Users = require('./users-model.js')



//Registers user and hashes password


router.post('/register', (req, res) => {
    let { username, password} = req.body;
    const hash = bcrypt.hashSync(password);
    
    console.log(req.body)

    Users.add({username, password: hash})
        .then(newUser => {
            console.log(newUser)
            res.status(201).json(newUser)
        })
        .catch(error => {
            res.status(500).json(error)
        });
});

module.exports = router;