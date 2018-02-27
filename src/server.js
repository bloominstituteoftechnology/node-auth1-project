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

server.use((req, res, next) => {
  const check = req.originalUrl.split('/restricted');
  if (check.length > 1 && req.session.user) {
    next();
  } else if (check.length > 1 && !req.session.user) {
    res.status(500).send({ error: 'You must be logged in for access to NSA documents.' });
  } else {
    next();
  }
});

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

const logInCheck = (req, res, next) => {
  const session = req.session;
  if (session.user) {
    req.user = session.user;
    next();
  } else {
    sendUserError('Need to log in to access NSA data.', res);
  }
};


server.post('/users', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    sendUserError('Must provide both username & password.', res);
    return;
  }

  bcrypt.hash(password, BCRYPT_COST)
    .then((data) => {
      const user = new User({ username, passwordHash: data })
      user.save()
        .then((newUser) => {
          res.status(200).send(newUser);
        }).catch((err) => {
          sendUserError('Could not save new user.', res);
        });
    });
});

// to test stretch problem
server.get('/restricted/users', (req, res) => {
  User.find()
    .then((user) => {
      res.status(200).send(user);
    }).catch((error) => {
      res.status(500).send({ error: 'Unable to retrieve users.' });
    });
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  const session = req.session;

  if (!username || !password) {
    sendUserError('Must provide both username & password.', res);
    return;
  }

  User.findOne({ username })
    .then((data) => {
      bcrypt.compare(password, data.passwordHash)
       .then((match, err) => {
         if (match) {
           session.loggedIn = true;
           session.user = username;
           res.status(200).send({ success: session.loggedIn });
         } else {
           sendUserError({ success: false }, res);
         }
       });
    });
});

server.get('/me', logInCheck, (req, res) => {
  res.json(req.user);
});

module.exports = { server };
