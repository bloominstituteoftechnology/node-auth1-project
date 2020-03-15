const express = require("express")
const Users = require("../users/users-model")
const bcrypt = require('bcryptjs')

const router = express.Router()

router.post("/register", async (req, res, next) => {
	try {
		const { username } = req.body
		const user = await Users.findBy({ username }).first()
		//const hash = await bcrypt.hash(password, 10)

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
        const user = await Users.findBy({ username })
        .first()
		// const hash = await bcrypt.hash(password, 10)

		// since bcrypt hashes generate different results due to the salting,
		// we rely on the magic internals to compare hashes rather than doing it
		// manually with "!=="
		const passwordValid = await bcrypt.compare(password, user.password)

		//if the user is true then we authenticate and if it is invalid we return an error message.
		if (!user || !passwordValid) {
			return res.status(401).json({
				message: "Invalid Credentials",
			})
		}
        req.session.user = user;
		res.json({
			message: `Welcome ${user.username}!`,
		})
	} catch(err) {
		next(err)
	}
})

module.exports = router