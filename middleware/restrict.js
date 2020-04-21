const bcrypt = require("bcryptjs");
const Users = require("../users/users-model.js");

const sessions = {};

function restrict() {
	const authError = {
		message: "Invalid credentials"
	};
	return async (req, res, next) => {
		try {
			if (!req.session || !req.session.user) {
				return res.status(401).json(authError);
			}

			next();
		} catch (error) {
			next(error);
		}
	};
}

module.exports = {
	sessions,
	restrict
};
