function restrict() {
	const authError = {
		message: "Invalid credentials",
	}
	
	return async (req, res, next) => {
		try {
			if (!req.session || !req.session.user) {
				return res.status(401).json(authError)
			}

			// if we reach this point, the user is considered authorized!
			next()
		} catch (err) {
			next(err)
		}
	}
}

module.exports = restrict