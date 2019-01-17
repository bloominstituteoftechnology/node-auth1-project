const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

const userDB = require('../data/helpers/usersDb');

router.post('/register', (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 15);

    userDB.add(user)
        .then(id => {
            res.status(201).json(id);
        })
        .catch(err => {
            res.status(500).json({ errorMessage: 'Failed to insert user' });
        }) 
});

router.post('/login', (req, res) => {
   const user = req.body;
   
   userDB.get(user)
    .then(users => {
        if(users.length && bcrypt.compareSync(user.password, users[0].password)) {
            res.json({ message: 'Logged in' });
        } else {
            res.status(404).json({ message: 'You shall not pass' })
        }
    })
    .catch(err => {
        res.status(500).json({ errorMessage: 'Failed to verify. Please try again.' })
    });
});

module.exports = router;