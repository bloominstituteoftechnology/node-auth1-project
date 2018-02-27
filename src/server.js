const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const User = require('./user');
const bcrypt = require('bcrypt');

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

// TODO: implement routes
server.post('/users', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    sendUserError('Please provide a username and password.', res)
    return;
  }
  bcrypt.hash(password, 11, (err, hash) => {
  	if (err) {
  		throw err;
  	}
  	const newUser = new User({username: username, password: hash});
    newUser.save()
      .then((savedUser) => {
        res.status(200).json(savedUser);
      })
      .catch((error) => {
        res.status(500).json({ error: 'Could not connect to the server' });
      });
  })
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
	if (!username || !password) {
    sendUserError('Please provide a username and password.', res)
    return;
  }
  User.findOne({ username })
  	.then((user) => {
  		if (user) {
        const hash = user.password;
  		  bcrypt.compare(password, hash, (err, isValid) => {
  		  	if (err) throw err;
  		  	if (isValid) {
  		  		req.session.login = true;
  		  		res.status(200).json({ success: true });
  		  	} else {
  		  		sendUserError('Invalid password!', res);
  		  	}
  		  })
  		} else {
  			sendUserError('Invalid username!', res);
  		}
  	})
  	.catch(err => {
  		res.status(500).json({ error: 'Could not connect to the server'});
  	});
})

const loggedIn = (req, res, next) => {
	if (!req.session.login) {
		sendUserError('You are not logged in.', res);
		return;
	}
	next();
}

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', loggedIn, (req, res) => {
  // Do NOT modify this route handler in any way.
  console.log('req.user', req.user);
  res.json(req.user);
});

module.exports = { server };
