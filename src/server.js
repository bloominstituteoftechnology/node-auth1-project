const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./user.js');


const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  resave: true,
  saveUninitialized: true
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
  if (!password || !username) {
    sendUserError('must provide a username and password', res);
    return;
  }
  bcrypt.hash(password, BCRYPT_COST, (err, hash) => {
    if (err) {
      sendUserError(err, res);
      return;
    }
    const newUser = new User({ username, passwordHash: hash });
    newUser.save()
      .then((user) => {
        res.json(user);
      })
      .catch((error) => {
        sendUserError(error, res);
      });
  });
});
server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    sendUserError('please send both', res);
    return;
  }
  User.findOne({ username }).exec()
  .then((user) => {
    bcrypt.compare(password, user.passwordHash, (err, result) => {
      if (err) sendUserError(err, res);
      else if (result) {
        req.session.user = user.username;
        res.json({ success: true });
      } else sendUserError('wrong password', res);
    });
  })
  .catch((error) => {
    sendUserError(error, res);
  });
});
// TODO: add local middleware to this route to ensure the user is logged in
server.use('/me', (req, res, next) => {
  if (req.session.user) {
    User.findOne({ username: req.session.user }).exec()
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        sendUserError(err, res);
      });
  } else sendUserError('not logged in!', res);
});
server.use('/restricted', (req, res, next) => {
  if (req.session.user) next();
  else sendUserError('not logged in!', res);
});

server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
