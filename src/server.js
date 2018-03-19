const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');

const User = require('./user');

const STATUS_USER_ERROR = 422;
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

const hashPasswordMiddleware = (req, res, next) => {
  const { passwordHash } = req.body;
  
  if (!passwordHash) {
    sendUserError('You must provide a password', res);
    return;
  }
  bcrypt.hash(passwordHash, BCRYPT_COST)
    .then(hashedPassword => {
      req.password = hashedPassword;
      next()
    })
    .catch(error => { error: 'There was an error', error });
};

// TODO: implement routes
server.post('/users', hashPasswordMiddleware, (req, res) => {
  const { username, passwordHash } = req.body;
  const hashedPW = req.password;
  const user = new User({ username: username, passwordHash: hashedPW });

  if (!username) {
    res.status(STATUS_USER_ERROR).json({ error: 'You must provide a username' });
  }

  // save user in MongoDB (create)
  user.save()
  .then(savedUser => {
    res.status(200).json(savedUser);
  })
  .catch(error => { error: 'There was an error saving user' });
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
