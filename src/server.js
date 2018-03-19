/*eslint-disable*/
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const User = require ('./user.js');
const bcrypt = require('bcrypt');

const STATUS_USER_ERROR = 422;
const STATUS_SUCCESS = 200;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
}));

const logInTracker = (req, res, next) => {
	if (res.session.loggedIn) {
		User.findOne({ username: req.session.username })
			.then(user => {
				res.user = user;
				next();
			})
			.catch(err => {
				sendUserError(err, res);
			});
	}	else {
		sendUserError(err, res);
	}
}

server.post('/users', (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) {
		res.status(STATUS_USER_ERROR).json('Username or password does not match the user.');
	} else {
		bcrypt.hash(password, BCRYPT_COST, (err, hash) => {
			const newUser = { username, passwordHash: hash };
			const user = new User(newUser);
			if (err) {
				sendUserError(err, res);
			} else {
				user
					.save()
					.then(createUser => {
						res.status(STATUS_SUCCESS).json(createUser);
					})
					.catch(err => {
						sendUserError(err, res);
					});
			}
		});
	}
});

server.post('/log-in', (req, res) => {
	const { username, password } = req.body;
	const hash = req.passwordHash;

	bcrypt.compare(password, hash, (err, res) => {
		if (err) {
			sendUserError(err, res);
		}
		else if (res) {
				res.json({ success: true });
				return;
		} else {
			sendUserError(err, res);
		}
	})
});

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

// TODO: implement routes

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
