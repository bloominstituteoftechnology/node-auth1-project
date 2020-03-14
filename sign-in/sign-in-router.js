const express = require("express")
const router = express.Router()
const Signin = require("./sign-in-model")
const bcrypt = require("bcryptjs")

router.post('/', async (req, res, next) => {
    try {
        let { username, password} = req.body
        const user = await Signin.getUser({username})
        const passwordValid = await bcrypt.compare(password, user.password)

        if(user && passwordValid) {
            res.status(200).json({
                message: `Welcome ${user.username}!`
            })
        } else {
            res.status(401).json({
                error: `Invalid credentials.`
            })
        }
    }
    catch(err) {
        next(err)
    }
})

module.exports = router 