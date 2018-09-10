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

router.get("/", (req, res) => {
	db("users")
		.select("id", "username")
		.then(users => {
			res.json(users);
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
				res.status(200).send("Welcome");
			} else {
				res.status(401).json({ message: "Not authenticated" });
			}
		})
		.catch(err => res.status(500).send(err));
});

module.exports = router;
