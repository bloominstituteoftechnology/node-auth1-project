const router = require("express").Router();
const User = require("../users/userModel");

router.get("/", (req, res) => {
	User.find()
		.then(users => {
			res.status(200).json(users);
		})
		.catch(err => {
			res.status(500).json({
				errrorMessage: "There was an error retrieving the list of users"
			});
		});
});

module.exports = router;
