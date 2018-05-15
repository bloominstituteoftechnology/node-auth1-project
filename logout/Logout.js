const router = require("express").Router();

router.get("/", (req, res) => {
	// only logged in users can have a session object
	// log out users by destroying their session object
	if (req.session) {
		req.session.destroy(function(err) {
			if (err) {
				res.send("error");
			} else {
				res.send("good-bye");
			}
		});
	}
});

module.exports = router;
