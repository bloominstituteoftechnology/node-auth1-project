const router = require('express').Router();
const Users = require('../models/users-model.js')
const bcrypt = require('bcryptjs')


router.get('/', (req,res) => {
    Users.get()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(error => {
            console.error(error)
        })
})

module.exports = router