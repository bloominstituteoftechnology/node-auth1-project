const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./user');

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

  if (!username) return sendUserError('Must provide a username in post/users', res);
  if (!password) return sendUserError('Must provide a password in post/users', res);

  bcrypt.hash(password, BCRYPT_COST, (bcryptErr, passwordHash) => {
    if (bcryptErr) return sendUserError(bcryptErr, res);
    if (!passwordHash) return sendUserError('The password failed to hash', res);

    const user = new User({ username, passwordHash });
    user.save((err) => {
      if (err) return sendUserError(err, res);
      res.status(200);
      res.json(user);
    });
  });
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;

  if (!username) return sendUserError('Must provide a username', res);
  if (!password) return sendUserError('Must provide a password', res);

  User.findOne({ username }, (err, user) => {
    if (err) return sendUserError(err, res);
    if (!user) return sendUserError('Failed to find a user', res);

    const { _id, passwordHash } = user;
    bcrypt.compare(password, passwordHash, (bcryptErr, isValid) => {
      if (bcryptErr) return sendUserError(bcryptErr);
      if (isValid) {
        req.session.user = _id;
        res.json({ success: true });
      } else {
        return sendUserError('Incorrect password', res);
      }
    });
  });
});

const loggedIn = (req, res, next) => {
  const userID = req.session.user;
  if (!userID) {
    return sendUserError('You must be logged in', res);
  }
  User.findById(userID, (err, user) => {
    if (err) return sendUserError(err, res);
    req.user = user;
    next();
  });
};

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', loggedIn, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

// EXTRA CREDIT
/* write a piece of global middleware that ensures a user is logged in when accessing
 * any route prefixed by /restricted/. */

const restrictedRoutes = ((req, res, next) => {
  const { url } = req;
  if (/restricted/.test(url)) {
    console.log('found a restricted url');
    const userID = req.session.user;
    if (!userID) {
      console.log(req.session.user);
      return sendUserError('You must be logged in to access a restricted url', res);
    }
  }
  next();
});

server.use(restrictedRoutes);

server.get('/restricted', (req, res) => {
  res.json({ restricted: true });
});

server.get('/restricted/me', (req, res) => {
    res.json({ restrictedMe: true });
});

module.exports = { server };
