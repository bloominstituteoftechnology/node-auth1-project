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
server.use(
  session({
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
  })
);

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

const checkLogin = (req, res, next) => {
  const thisSession = req.session;
  if (thisSession.user) {
    User.findOne({ username: thisSession.user })
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        sendUserError(err, res);
      });
  } else {
    sendUserError('Please log in.', res);
  }
};

server.post('/users', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    sendUserError('Please provide Username & Password.', res);
    return;
  }
  bcrypt.hash(password, BCRYPT_COST).then((data) => {
    const user = new User({ username, passwordHash: data });
    user
      .save()
      .then((newUser) => {
        res.status(200).send(newUser);
      })
      .catch((err) => {
        sendUserError('Unable to save new user.', res);
      });
  });
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  const thisSession = req.session;
  if (!username || !password) {
    sendUserError('Please provide Username & Password.', res);
    return;
  }

  User.findOne({ username })
    .then((data) => {
      bcrypt
        .compare(password, data.passwordHash)
        .then((match, err) => {
          if (match) {
            thisSession.user = username;
            res.status(200).send({ success: true });
          } else {
            sendUserError({ success: false }, res);
          }
        })
        .catch((error) => {
          sendUserError({ error: 'Incorrect password.' });
        });
    })
    .catch((err) => {
      sendUserError({ error: 'Unable to find user.' }, res);
    });
});

server.get('/me', checkLogin, (req, res) => {
  res.json(req.user);
});

module.exports = { server };
