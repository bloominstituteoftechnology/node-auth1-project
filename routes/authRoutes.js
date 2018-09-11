const express = require("express");
const router = express.Router();
const db = require("../dbConfig");
const bcrypt = require("bcryptjs");

router.post("/register", (req, res) => {
	const credentials = req.body;
	const hash = bcrypt.hashSync(credentials.password, 14);
	credentials.password = hash;

	db("users")
		.insert(credentials)
		.then(ids => {
			const id = ids[0];

			res.status(201).json(id);
		})
		.catch(err => res.status(500).send(err));
});

router.post("/login", (req, res) => {
	const credentials = req.body;
	db("users")
		.where({ username: credentials.username })
		.first()
		.then(user => {
			if (
				user &&
				bcrypt.compareSync(credentials.password, user.password)
			) {
				req.session.name = credentials.username;
				res.status(200).send(`Welcome ${req.session.name}`);
			} else {
				res.status(401).json({ message: "Not authenticated" });
			}
		})
		.catch(err => res.status(500).send(err));
});

router.get("/logout", (req, res) => {
	if (req.session) {
		req.session.destroy(err => {
			if (err) {
				res.status(500).json({ message: "This be an error jerk face" });
			} else {
				res.send("goodbye");
			}
		});
	}
});

module.exports = router;
