const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../users/userModel");
module.exports = {
	authenticate: function authenticate(req, res, next) {
		const { username, password } = req.body;
		// console.log("username: ", username);
		// console.log("password: ", password);

		// validate user info
		if (!username || !password) {
			res
				.status(400)
				.json({ errorMessage: "Please provide a username and password" });
			return;
		}

		User.find({ username: username })
			.then(user => {
				// console.log("user: ", user[0]);
				// compare user password to the password in request body
				bcrypt.compare(password, user[0].password, (err, isValid) => {
					if (err) {
						console.log("passwords don't match");
						res.status(400).json({ errorMessage: "You shall not pass!" });
						return;
					}
					if (isValid) {
						console.log("passwords match");
						// save user data inside request variable
						req.username = username;
						req.password = password;
						req.userID = user[0]._id;
						next();
					}
				});
			})
			.catch(err => {
				console.log(err);
			});
	}
};
