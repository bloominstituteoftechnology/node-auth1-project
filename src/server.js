const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./user');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

// req & res now have a .session object on them
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
}));

/* Sends the given err, a string or an object, to the client. Sets the status
 * code appropriately. */
// Middleware
const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack });
  } else {
    res.json({ error: err });
  }
};

const hashPassword = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return sendUserError('Provide a password', res);
  }
  bcrypt.hash(password, BCRYPT_COST)
    .then((hash) => {
      req.passwordHash = hash;
      next();
    })
    .catch((err) => {
      sendUserError(err, res);
    });
};

const loggedInUser = (req, res, next) => {
  if (!req.session.username || !req.session.user) {
    return sendUserError('User is not logged in.', res);
  }
  res.status(200).json(req.session.user);
  next();
};

server.use('/restricted/*', (req, res, next) => {
  if (!req.session.username || !req.session.user) {
    return sendUserError('Must be logged in to view.', res);
  }
  next();
});


// TODO: implement routes
server.post('/users', hashPassword, (req, res) => {
  const { username } = req.body;
  if (!username) return sendUserError(('Please provide a username'), res);
  const { passwordHash } = req;
  const newUser = new User({ username, passwordHash });
  newUser.save()
    .then((user) => {
      if (!user) return sendUserError(('User creation failed'), res);
      res.status(200).json(user);
    })
    .catch((error) => {
      sendUserError(error, res);
    });
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  // VALIDATE username and password
  if (!username || !password) return sendUserError('Must provide all login credentials', res);
  User.findOne({ username })
    .then((user) => {
      // is 'user' in the db? ERROR CHECKING
      if (!user) return sendUserError('User with that name does not exists', res);
      // does the given pswd hashed = the stored hashed pswd? ERROR CHECKING
      // if (bcrypt.compareSync(password, user.passwordHash) === false) return sendUserError('Invalid password submission.', res);
      // .compareSync(password, dbHashedPassword) => true/false
      // .compareSync okay for this simple assignment but async bcrypt more efficient
      if (bcrypt.compareSync(password, user.passwordHash)) {
        req.session.username = username;
        req.session.user = user;
        res.status(200).json({ success: true });
      } else {
        return sendUserError('Password is not valid', res);
      }
      // NO ERRORS
      // ADD SOME UNIQUE INFO TO THE SESSION OBJ
      // req.session.username = username;
      // EVERYTHING IS ALL GOOD
      // res.status(200).json({ success: true });
    })
    .catch((error) => {
      sendUserError(error, res);
    });
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', loggedInUser, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

// server.listen(3000);

module.exports = { server };
