const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Users = require("../users/users-model.js");
const uuid = require("uuid");

const activeSessions = [];

router.post("/register", (req, res) => {
	Users.add(user)
		.then(saved => {
			res.status(201).json(saved);
		})
		.catch(error => {
			res.status(500).json(error);
		});
});

router.post("/login", (req, res) => {
	Users.findBy({ username })
		.first()
		.then(user => {})
		.catch(error => {
			res.status(500).json(error);
		});
});

function protected(req, res, next) {}

router.protected = protected;

module.exports = router;
