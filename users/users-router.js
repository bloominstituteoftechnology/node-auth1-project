const express = require('express')
const Users = require('./users-model')
const router = express.Router()
const bcrypt = require('bcryptjs')
const usersMiddleware = require('./users-middleware')

router.get("/users", usersMiddleware.restrict(), async (req, res, next) => {
    try {
        res.json(await Users.find())
    } catch(err) {
        next(err)
    }
})

router.post("/users", async (req, res, next) => {
	try {
		const { username, password } = req.body
		const user = await Users.findBy({ username }).first()

		if (user) {
			return res.status(409).json({
				message: "Username is already taken",
			})
		}

		const newUser = await Users.add({
            username,
            //hash the password with a time complexity of '10'
			password: await bcrypt.hash(password, 13)
		})

		res.status(201).json(newUser)
	} catch(err) {
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

        //check that the password is valid here.
        //compare the plain text password from the request body
        //to the hash we have stored in the database. returns true or false
        const passwordValid = await bcrypt.compare(password, user.password)

        //check if hash of request body password matches the hash we already have
        if(!passwordValid) {
            return res.status(401).json({
                message: "Invalid credentials"
            })
        }

        //create a new session for the user
        req.session.user = user

        res.json({
            message: `Welcome ${user.username}`
        })
    } catch(err) {
        next(err)
    }
})

module.exports = router