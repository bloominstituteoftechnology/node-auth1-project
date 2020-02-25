const express = require('express');
const Users = require('./usersModel.js');
const restricted = require('../../authentication/restrictedMiddleware.js');
const router = express();

// Gets a list of all users
router.get('/', restricted, (req, res) => {
    Users.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(error => {
            res.status(500).json({message: `Error retrieving all users: ${error}`});
        })
})

module.exports = router;