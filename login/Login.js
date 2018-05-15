const router = require("express").Router();
const User = require("../users/userModel");

router.post("/", (req, res) => {
	// console.log("made it");
	// console.log(req.username);
	// console.log(req.password);
	// console.log(req.userID);
	// console.log(req.user);

	// // create a new session
	// const session = req.session;
	// session.userID = req.userID;
	// session.user = req.user;
	// console.log("session id: ", session.userID);
	// // return a cookie with a message containing the userID
	// res.status(200).json({ message: "Logged In", userID: session.userID });

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
		.catch();
});

module.exports = router;
