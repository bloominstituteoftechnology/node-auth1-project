const mongoose = require("mongoose");
const User = require("../users/userModel");
// check if a user exists in the current session
module.exports = {
	validateLogIn: function(req, res, next) {
		const { user } = req.session;

		// if user is logged in pass an array of all the users
		if (user) {
			console.log("User is logged in. Welcome!");
			console.log("user: ", user);
			next();
		} else {
			res.status(400).json({ errorMessage: "You shall not pass!" });
			return;
		}
	}
};
