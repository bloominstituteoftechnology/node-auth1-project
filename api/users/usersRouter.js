const router = require('express').Router();

const Users = require('../users/usersModel')

router.get('/', (req,res) => {
    Users.find()
    .then(users => {
        users 
            ? res.status(200).json(users)
            : res.status(400).json({ error: "Failed to retrieve the users" })
    })
    .catch(error => res.status(500).json({ error: error }))
})

module.exports = router;