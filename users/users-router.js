const express = require('express')
const bcrypt = require("bcryptjs")
const router = express.Router()
// const { restrict } = require("./users-middleware")

const User = require('./users-model')


router.get("/users",   async (req, res, next) => {
	try {
		res.json(await User.find())
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
			// hash the password with a time complexity of 14
			password,
		})

		res.status(201).json(newUser)
	} catch(err) {
		next(err)
	}
})

module.exports = router