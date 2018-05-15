const router = require("express").Router();
const User = require("../users/userModel");

router.post("/", (req, res) => {
	const { username, password } = req.body;

	User.findOne({ username })
		.then(user => {
			// validate user query object - user must exist for log in to occur
			if (user) {
				// isPasswordValid() is a method on User
				user.isPasswordValid(password).then(isValid => {
					if (isValid) {
						// store username in session object after log in
						req.session.username = user.username;
						req.session.userID = user._id;
						res.send("log in successful");
					} else {
						res.status(400).send("invalid credentials");
					}
				});
			} else {
				// log in failed
				res.status(401).send("invalid credentials");
			}
		})
		.catch(err => {
			res.status(500).send(err);
		});
});

module.exports = router;
