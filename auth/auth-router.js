const express = require("express")
const bcrypt = require("bcryptjs")
const Users = require("../users/user-model")

const router = express.Router()

router.post("/register", async (req, res, next) => {
	try {
		const { username } = req.body
		const user = await Users.findBy({ username }).first()

		if (user) {
			return res.status(409).json({
				message: "Username is already taken",
			})
		}

		res.status(201).json(await Users.add(req.body))
	} catch(err) {
		next(err)
	}
})

router.post("/login", async (req, res, next) => {
	try {
		const { username, password } = req.body
		const user = await Users.findBy({ username }).first()

		// since bcrypt hashes generate different results due to the salting,
		// we rely on the magic internals to compare hashes rather than doing it
		// manually with "!=="
		const passwordValid = await bcrypt.compare(password, user.password)

		if (!user || !passwordValid) {
			return res.status(401).json({
				message: "Invalid Credentials",
			})
		}

		res.json({
			message: `Welcome ${user.username}!`,
		})
	} catch(err) {
		next(err)
	}
})

module.exports = router