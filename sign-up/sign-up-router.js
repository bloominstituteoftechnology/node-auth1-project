const express = require("express")
const Signup = require("./sign-up-model")
const router = express.Router()

router.get("/", async (req, res, next) => {
    const users = await Signup.get()
    res.json(users)
})

router.post('/', async (req, res, next) => {
    try {
        const newUser = await Signup.signup(req.body)
        res.json(newUser)
    }
    catch(err) {
        next(err)
    }
})

module.exports = router