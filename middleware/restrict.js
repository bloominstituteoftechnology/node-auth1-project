const bcrypt = require('bcryptjs');
const Users = require('../users/user-model');

function restrict() {
	return async (req, res, next) => {
		const error = {
			message: 'invalid Credentials'
		};
		try {
			const { username, password } = req.headers;
			if (!username || password) {
				return res.status(401).json(error);
			}

			const user = await Users.findByFilter({ username }).first();
			if (!user) {
				return res.status(401).json(error);
			}

			const passwordValid = await bcrypt.compare(password, user.password);
			if (!passwordValid) {
				return res.status(401).json(error);
			}
		} catch (err) {
			next(err);
		}
	};
}

module.exports = restrict;
