const bcrypt = require("bcryptjs")
const Users = require("./users-model")

function restrict() {
	// This middleware function should restrict routes to authorized users only.
	// It should get the username and password from the request headers.
	return async (req, res, next) => {
		const authError = {
			message: "Invalid credentials",
		}

		try {
			if (!req.session || !req.session.user) {
				return res.status(401).json(authError)
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