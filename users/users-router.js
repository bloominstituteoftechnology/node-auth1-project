const express = require('express')
const Users = require('./users-model')

const router = express.Router()

// GET all users
router.get('/users', async (req, res, next) => {
    try {
        res.json(await Users.findAll())
    } catch(error) {
        next(error)
    }
})

// ADD user
router.post("/register", async (req, res, next) => {
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
			password,
		})

		res.status(201).json(newUser)
	} catch(err) {
		next(err)
	}
})

module.exports = router