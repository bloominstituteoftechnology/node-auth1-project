const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

module.exports = {
	authenticate: function authenticate(req, res, next) {
		const restricted = /restricted/;
		const path = req.baseUrl;
		console.log("path: ", path);
		// force users to log in when path contains "restricted"
		if (restricted.test(path) && req.session.username) {
			console.log("made it to a restricted page");
			next();
		} else {
			// user is not logged in, redirect user
			console.log("THIS IS A RESTRICTED PAGE. GO LOG IN");
			res.redirect("/");
		}
	}
};
