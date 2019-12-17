// const bcrypt = require("bcryptjs");
const express = require('express')
const router = require('express').Router();

const Users = require('./users-model');

const authenticated = require('../middleware/restricted-middleware')


router.get('/', authenticated, (req, res) => {
  Users.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
        res.status(500).json({ error: `failed to get user list`})
    });
});


// router.post('/login', authenticated,  (req, res) => {
//     let { username, password } = req.body;
//     Users.findBy({ username })
//     .then(user => {
//         if (user && bcrypt.compareSync(password, user.password)) {
//             res.status(200).json({ message: `${user.username} Logged In!` });
//         } else {
//             res.status(401).json({ message: 'You Shall Not Pass!' });
//         }
//     })
//     .catch(error => {
//         console.log(error);
//         res.status(500).json({ errorMessage: 'Failed to retrieve credentials '});
//     })
// });

module.exports = router;
