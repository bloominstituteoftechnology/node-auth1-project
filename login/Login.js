const router = require("express").Router();
const User = require("../users/userModel");

router.post("/", (req, res) => {
	console.log("made it");
	console.log(req.username);
	console.log(req.password);
	console.log(req.userID);
	console.log(req.user);

	// create a new session
	const session = req.session;
	session.userID = req.userID;
	session.user = req.user;
	console.log("session id: ", session.userID);
	// return a cookie with a message containing the userID
	res.status(200).json({ message: "Logged In", userID: session.userID });
});

module.exports = router;
