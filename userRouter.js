const router = require('express').Router();
const bcrypt = require('bcryptjs');


const Users = require('./data_model');




router.get('/', (req, res) => {
    Users.findAll().then(users => {
        if(users.length > 0) {
            res.status(201).json(users)
        } else {
            res.status(404).json({message:'no users found'})
        }
    })
    .catch(err => {
        console.log('Error getting all the damn users',err)
    })
})

module.exports = router;