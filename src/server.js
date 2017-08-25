const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

const User = require('./user.js');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;
console.log('server');
const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  // https://github.com/expressjs/session/issues/56
  // https://github.com/expressjs/session#options
  resave: true,
  saveUninitialized: false,
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
const validateUserPassword = server.use((req, res, next) => {
  const username = req.query.username;
  const { password } = req.body;
  console.log(req.body);
  if (!username || !password) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'Provide both username and password' });
    return;
  }
  next();
});
// TODO: implement routes
server.post('/users', validateUserPassword, (req, res) => {
  const username = req.query.username;
  const { password } = req.body;
  bcrypt.hash('password', 11, (err, hash) => {
    if (err) {
    res.status(STATUS_USER_ERROR);
    res.json({ err: err.message });
    } else {
      res.json({ 'passwordHash': hash, username });
    }
  });
        // should be returning new user -Tai
  const newUser = new User({ username, password });
  newUser.save((err, user) => {
    if (err) {
      res.status(STATUS_USER_ERROR);
      res.json(err);
    }
    res.json(user);
  });
});

server.post('/log-in', validateUserPassword, (req, res) => {
  const username = req.query.username;
  const { password } = req.body;
  User.findOne({ username }, (err, User) => {
    if(!user) {
      sendUserError({ error: 'No user' }, res);
      return;
    }
    bcrypt.compare('password', hash, (err, isSame) => {
      if (err) {
        res.status(STATUS_USER_ERROR);
        res.json({ err: err.message });
        return;
      }
    });
    res.json({ success: true });
  });
});
// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };