const router = require("express").Router();
const User = require("../users/userModel");

router.post("/", (req, res) => {
	// instantiate a new user with the given user data
	const user = new User(req.body);

	user
		.save()
		.then(user => {
			// return a user with a hashed password
			res.status(201).send(user);
		})
		.catch(err => {
			res.status(500).send(err);
		});
});

module.exports = router;
