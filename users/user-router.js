
const express = require("express")
const bcrypt = require("bcryptjs")
const Users = require("./user-model")

const router = express.Router()

router.get('/users', async (req,res,next) => {
    try {
        res.json(await Users.findUser())

    } catch(err) {
        next(err)
    }
})

router.post('/register', async (req,res,next) => {
    try {
        const {username,password} = req.body
        const user = await Users.findUserBy({username}).first()

        if(user) {
            return res.status(409).json({
                message: "Username is already taken"
            })
        }

        const createUser = await Users.addUser({
            username,
            password: await bcrypt.hash(password,14)
        })

        res.status(201).json(createUser)
    } catch(err) {
        next(err)
    }
})

router.post('/login', async (req,res,next) => {
    try {
        const {username,password} = req.body
        const user = await Users.findUserBy({username}).first()

        if(!user) {
            return res.status(401).json({
                message: "Invalid Credentials"
            })
        }

        const passwordValid = await bcrypt.compare(password, user.password)

        if(!passwordValid) {
            return res.status(401).json({
                message: "Invalid Password"
            })
        }

        req.session.user = user
        res.json({
            message: `Welcome ${user.username}`
        })
    } catch(err) {
        next(err)
    }
})

module.exports = router