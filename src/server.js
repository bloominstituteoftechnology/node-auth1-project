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


// TODO: implement routes
server.post('/users', (req, res) => {
  const { username, password } = req.body;
  const newUser = { username, passwordHash: password };

  if (!username || !password) {
    res.status(422).json({ error: 'Username and Password required' });
  } else {
    const user = new User(newUser);
    user.save()
      .then((response) => {
        res.status(200).json({ username: response.username, passwordHash: response.passwordHash });
      })
      .catch(error => sendUserError(error, res));
  }
});

server.post('/log-in', (req, res) => {
  const UA = req.headers.cookie;
  req.session.UA = UA;
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(422).json({ error: 'Username and Password required' });
  }
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.status(422).json({ error: 'User does not exist!' });
      }
      user.checkPassword(password, (err, isValid) => {
        if (err) return sendUserError(err, res);
        if (isValid) {
          req.session.username = username;
          req.session.isAuth = true;
          res.status(200).json({ success: true });
        } else {
          res.status(422).json({ error: 'Incorrect Password' });
        }
      });
    })
    .catch(error => sendUserError(error, res));
});

const userLoggedIn = (req, res, next) => {
  if (!req.session.isAuth) {
    res.status(422).json({ error: 'Not logged in!' });
  } else {
    User.findOne({ username: req.session.username })
    .select('username passwordHash -_id')
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error' });
    });
  }
};
const restrictedCheck = (req, res, next) => {
  if (req.session) {
    if (!req.session.isAuth) {
      res.status(422).json({ error: 'Restricted! Not logged in!' });
    } else {
      next();
    }
  }
};

server.use('/restricted', restrictedCheck);

server.get('/restricted/test', (req, res) => {
  res.status(200).json({ success: "You're logged in!" });
});

  // TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', userLoggedIn, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
