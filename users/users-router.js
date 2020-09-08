const express = require('express')
const Users = require('./users-model')
const router = express.Router()

router.get("/users", async (req, res, next) => {
    try {
        res.json(await Users.find())
    } catch(err) {
        next(err)
    }
})























module.exports = router