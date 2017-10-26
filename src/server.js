const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const User = require('./user');

var bcrypt = require('bcrypt');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
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

const validateCreateUserParams = (req, res, next) => {
	const { username, password } = req.body;

	if (!username && !password) sendUserError('please provide a username and password', res);

	req.username = username;
	req.password = password;
	next();
}

const validateLoggedIn = (req, res, next) => {
	// redirect to login page if not logged in
	if (!req.session.loggedIn) sendUserError('not loggied in', res);

	req.user = req.session.user;
	next();
}

// global middleware for signed in users
server.use('/restricted/*', validateLoggedIn, (req, res, next) => {
	next();
})

server.post('/users', validateCreateUserParams, (req, res) => {
	const username = req.username;
	const passwordHash = bcrypt.hashSync(req.password, 11);
	const newUser = User({ username, passwordHash });

	newUser.save()
		.then(nu => res.json(nu))
		.catch(err => res.status(500).json(err))
})

server.post('/log-in', validateCreateUserParams, (req, res) => {
	// get users password hash
	User.findOne()
		.where('username').equals(req.username)
		// .select('passwordHash')
		.then(userDoc => {
			if(bcrypt.compareSync(req.password, userDoc.passwordHash)) {
			 // Passwords match
			 const session = req.session;
			 session.loggedIn = true;
			 session.user = userDoc.username;  // is passing a unique username good enough for a session uuid?
			 res.json({ success: true });
			} else {
			 // Passwords don't match
			 sendUserError('incorrect password', res);
			}
		})
		.catch(err => sendUserError('that username does not exist', res));

})

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', validateLoggedIn, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

server.get('/restricted/something', (req, res) => {
	res.send('yo');
})

module.exports = { server };
