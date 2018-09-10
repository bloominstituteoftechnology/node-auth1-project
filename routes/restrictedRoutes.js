const express = require("express");
const router = express.Router();
const db = require("../dbConfig");

router.get("/users", (req, res) => {
	db("users")
		.select("id", "username")
		.then(users => {
			res.json(users);
		})
		.catch(err => res.status(500).send(err));
});
