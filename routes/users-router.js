const router = require('express').Router();
const Users = require('../models/users-model.js')
const onlyValidUsers = require('../middleware/restriction-middleware.js')


router.get('/', onlyValidUsers, (req,res) => {
    Users.get()
        .then(allusers => {
            res.status(200).json(allusers)
        })
        .catch(error => {
            console.error(error)
        })
})

module.exports = router