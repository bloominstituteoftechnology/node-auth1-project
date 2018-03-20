/* eslint-disable */
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

const User = require ('./user.js');

const STATUS_USER_ERROR = 422;
const STATUS_SUCCESS = 200;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests

server.use(bodyParser.json());
server.use(session({
	secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
	resave: true,
	saveUninitialized: false
}));

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
const logInTracker = (req, res, next) => {
	const { username } = req.session;
	if (!username) {
		sendUserError('You are not logged in', res);
		return;
	} else {
		User.findOne({ username }, (err, user) => {
			if (err) {
				sendUserError(err, res);
			} else if (!user) {
				sendUserError('User does not exist', res);
			} else {
				req.user = req.session.user;
				next();
			}
		});
	}
};

const hashPassword = (req, res, next) => {
	const { 
		password
	} = req.body;

	if (!password) {
		sendUserError('You need to enter password', res);
		return;
	} else {
		bcrypt.hash(password, BCRYPT_COST, (err, hash) => {
			if (err) {
				sendUserError(err, res);
			} else {
				req.hashedPW = hash;
				next();
			}
		});
	}
};

const restrictPermission = (req, res, next) => {
	if (!req.session.user) {
		sendUserError('You must log in first', res);
		return;
	}
	else {
		req.user = req.session.user;
	}
	next();
};

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

server.get('/users', (req, res) => {
	User.find({})
		.then(users => {
			res.status(200).json(users);
		})
		.catch(err => {
			res.status(500).json({ error: 'Error retrieving useres' });
		});
});

server.post('/log-in', hashPassword, (req, res) => {
	const { username, password } = req.body;
	const { hashedPW } = req;

	if (!username || !password) {
		res.status(STATUS_USER_ERROR).json('Username or password does not match the user.');
	} else {
		User.findOne({ username })
		.then((user) => {
			bcrypt.compare(password, user.passwordHash, (err, response) => {
				if (response) {
					req.session.user = user._id;
					res.status(STATUS_SUCCESS).json({ success: true });
				}
				else {
					sendUserError(err, res);
				}
			})
		})
		.catch(err => {
			sendUserError(err, res);
		});
	}
});

server.get('/restricted/', (req, res) => {
	res.json({ message: 'You are logged in.' });
});

server.use('/restricted', restrictPermission);

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', logInTracker, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
