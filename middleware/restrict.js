// Used w/o session
// const bcrypt = require("bcryptjs")
// const Users = require("../users/users-model")

function restrict() {
	const authError = {
		message: "Invalid credentials",
	}
	
	return async (req, res, next) => {
		try {
			//method checking username and password w/o session

			// const { username, password } = req.headers
			// if (!username || !password) {
			// 	return res.status(401).json(authError)
			// }

			// const user = await Users.findBy({ username }).first()
			// if (!user) {
			// 	return res.status(401).json(authError)
			// }

			// const passwordValid = await bcrypt.compare(password, user.password)
			// if (!passwordValid) {
			// 	return res.status(401).json(authError)
			// }
			//____________________________________________________________________
			//checking for session and user info

			if (!req.session || !req.session.user) {
				return res.status(401).json(authError)
			}
			next()
		} catch(err) {
			next(err)
		}
	}
}

module.exports = restrict