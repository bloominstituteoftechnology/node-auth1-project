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

module.exports = router;
