const bcrypt = require("bcryptjs")
const Users = require("../users/user-model")

function restrict() {
	// put in variable so we can re-use it
	const authError = {
		message: "Invalid credentials",
	}
	
	return async (req, res, next) => {
		try {
			const { username, password } = req.headers
			// make sure the values aren't empty
			if (!username || !password) {
				return res.status(401).json(authError)
			}

			const user = await Users.findBy({ username }).first()
			// make sure the user exists
			if (!user) {
				return res.status(401).json(authError)
			}

			const passwordValid = await bcrypt.compare(password, user.password)
			// make sure the password is correct
			if (!passwordValid) {
				return res.status(401).json(authError)
			}

			// if we reach this point, the user is authenticated!
			next()
		} catch(err) {
			next(err)
		}
	}
}

module.exports = restrict