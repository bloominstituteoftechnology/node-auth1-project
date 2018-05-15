const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../users/userModel");
module.exports = {
	authenticate: function authenticate(req, res, next) {
		if (req.session && req.session.username) {
			// user is logged in -> go to the next middleware/route
			next();
		} else {
			res.status(401).send("You shall not pass!!!");
		}
	}
};
