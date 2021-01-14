const bcrypt = require('bcryptjs')
const Users = require('./users-model')

function restrict() {
	// This middleware function should restrict routes to authorized users only.
	// It should get the username and password from the request headers.
	return async (req, res, next) => {
		const authError = { message: "Invalid credentials" }

		try {
			// check that values are not empty
			// const { username, password } = req.headers
			// if (!username || !password)
			// 	return res.status(401).json(authError)

			// // check that user exists in db
			// const user = await Users.findBy({ username }).first()
			// if (!user) {
			// 	return res.status(401).json(authError)
			// }

			// // make sure password is valid
			// const passwordValid = await bcrypt.compare(password, user.password)
			// if (!passwordValid) {
			// 	return res.status(401).json(authError)
			// }

			if (!req.session || !req.session.user){
				res.status(401).json(authError)
			}

			next()

		} catch (err) {
			next(err)
		}
	}
}

module.exports = {
	restrict,
}