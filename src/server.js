const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");

const corsOptions = {
	origin: "http://localhost:3000",
	credentials: true
};

const User = require("./user.js");

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());
server.use(
	session({
		secret: "e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re",
		saveUninitialized: false,
		resave: false
	})
);
server.use(cors(corsOptions));

const authenticate = function(req, res, next) {
	req.hello = `hello ${User}!`;

	next();
};

const restrictedM = (req, res, next) => {
	const path = req.path;
	if (/restricted/.test(path)) {
		if (!req.session.username) {
			sendUserError("NOPE", res);
			return;
		}
	}
	next();
};

server.use(restrictedM);

/* Sends the given err, a string or an object, to the client. Sets the status
 * code appropriately. */
const sendUserError = (err, res) => {
	res.status(STATUS_USER_ERROR);
	if (err && err.message) {
		res.json({ message: err.message, stack: err.stack });
	} else {
		res.json({ error: err });
	}
};

server.post("/users", (req, res) => {
	const { username, password } = req.body;
	const user = new User({ username, passwordHash: password });

	user
		.save()
		.then(savedUser => {
			res.status(200).json(savedUser);
		})
		.catch(err => {
			sendUserError(err, res);
		});
});

server.post("/login", (req, res) => {
	const { username, password } = req.body;
	// console.log(username, password);
	if (!username || !password) {
		sendUserError({ message: "NOPE" }, res);
	} else {
		User.findOne({ username })
			.then(user => {
				user
					.comparePassword(password)
					.then(KAIT => {
						if (KAIT) {
							req.session.name = user.username;
							res.status(200).json({ success: true });
						} else if (username === null) {
							return sendUserError("User does not exist", res);
						} else {
							sendUserError({ message: "Kait." }, res);
						}
					})
					.catch(err => {
						sendUserError(err, res);
					});
			})
			.catch(err => {
				sendUserError(err, res);
			});
	}
});

server.post("/logout", (req, res) => {
	const { username } = req.body;
	if (!username) {
		sendUserError({ message: "Goodbye" }, res);
		return;
	}
	username = null;
	res.json(req.session);
});

// TODO: add local middleware to this route to ensure the user is logged in
const logCheck = function(req, res, next) {
	const username = req.session.name;

	if (username) {
		User.findOne({ username }).then(user => {
			req.user = user;
			next();
		});
	} else {
		return sendUserError({ message: "You're not logged in!" }, res);
	}
};

server.get("/me", logCheck, (req, res) => {
	// Do NOT modify this route handler in any way.
	res.json(req.user);
});

server.get("/", logCheck, (req, res) => {
	User.find()
		.then(users => {
			res.status(200).json(users);
		})
		.catch(err => {
			sendUserError(err, res);
		});
});

// server.get("/restricted/users", restrictedM, (req, res) => {
server.get("/restricted/users", (req, res) => {
	User.find({}, (err, users) => {
		if (err) {
			sendUserError("500", res);
			return;
		}
		res.json(users);
	});
});

module.exports = { server };
