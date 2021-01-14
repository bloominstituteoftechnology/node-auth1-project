const express = require("express")
const bcrypt = require("bcryptjs")
const Users = require("./registermodel")

const router = express.Router()

router.post("/", async (req, res, next) => {
	try {
		const { user_name, password } = req.body
		const user = await Users.findBy({ user_name }).first()

		if (user) {
			return res.status(409).json({
				message: "Username is already taken",
			})
		}

		const newUser = await Users.add({
			user_name,
			// hash password with a time complexity of 14
			password: await bcrypt.hash(password, 14),
		})

		res.status(201).json(newUser)
	} catch(err) {
		next(err)
	}
})

module.exports = router