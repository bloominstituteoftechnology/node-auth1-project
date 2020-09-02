const express = require('express')
const Users = require('./users-model')

const router = express.Router()

router.get('/users', async (req, res, next) => {
    try {
        res.json(await Users.findAll())
    } catch(error) {
        next(error)
    }
})

module.exports = router