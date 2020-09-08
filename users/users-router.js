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

router.post('/users', async (req, res, next) => {
    try {
        const { username, password } = req.body
        const user = await Users.findBy({ username })

        if (user) {
            return res.status(409).json({
                message: "The username has already been taken"
            })
        }

        const newUser = await Users.add({
            username,
            password,
        })
        
        res.status(201).json(newUser)
    } catch (err) {
        next(err)
    }
})

router.post("/login", async (req, res, next) => {
    try {
        const {username, password} = req.body
        const user = await Users.findBy({ username }).first()

        if (!user) {
            return res.status(401).json({
                message: "Username or Password is incorrect"
            })
        }

        res.json({
            message: `Welcome ${user.usersname}`
        })
    } catch(err) {
        next(err)
    }
})

module.exports = router