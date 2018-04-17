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
  cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
  secure: false
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
  const userInfo = { username, passwordHash: password };
  const user = new User(userInfo);
  user
  .save()
  .then(doc => res.status(200).json(doc))
  .catch(err => sendUserError(err, res));
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  if (username === undefined) {
    sendUserError('username missing', res);
  } else if (password === undefined) {
    sendUserError('password missing', res);
  } else {
    User.find({})
    .then((users) => {
      let found = false;
      users.forEach((e) => {
        if (e.username === username) {
          found = true;
          e.isPasswordValid(password)
          .then((response) => {
            if (response === true) {
              req.session.user = e;
              res.status(200).json({ success: true });
            } else {
              sendUserError('password invalid', res);
            }
          });
        }
      });
      if (!found) {
        sendUserError('user not found', res);
      }
    })
    .catch((err) => {
      sendUserError(err, res);
    });
  }
});

const getSession = function (req, res, next) {
  if (req.session.user) {
    req.user = req.session.user;
  } else {
    sendUserError('no user logged in', res);
  }
  next();
};

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', getSession, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});


server.listen(5000, () => console.log('api on port 5000'));

module.exports = { server };
