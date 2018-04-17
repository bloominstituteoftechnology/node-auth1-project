const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');

const User = require('./user.js');

const STATUS_USER_ERROR = 422;
// const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(
  session({
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
    saveUninitialized: false,
    resave: true,
    cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
    secure: false,
    name: 'auth'
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

// TODO: implement routes

// Create User
server.post('/users', (req, res) => {
  const { username, password } = req.body;
  const user = new User(req.body);

  if (!username || !password) {
    res
      .status(STATUS_USER_ERROR)
      .json({ error: 'Please provide username and password.' });
  } else {
    user
      .save()
      .then(savedUser => res.status(200).json(savedUser))
      .catch(err => sendUserError(err, res));
  }
});

// User Login
server.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    User.findOne({ username })
      .then((user) => {
        user.isPassWordValid(password).then((response) => {
          if (response) {
            req.session.name = user.username;
            res.status(200).json({ success: true });
          } else {
            sendUserError(
              { message: 'Username and password are invalid.' },
              res
            );
          }
        });
      })
      .catch(err =>
        res.status(500).json({ errorMessage: 'There was an error logging in.' })
      );
  } else {
    sendUserError({ message: 'Please provide username and password.' }, res);
  }
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  if (req.session.name) {
    User.find()
      .then((users) => {
        if (users) {
          res.status(200).json(users);
        }
      })
      .catch((err) => {
        res.status(500).json({ errorMessage: 'No users yet.' }, res);
      });
  } else {
    sendUserError({ message: 'Please log in to see information.' }, res);
  }
});

// Logs User Out
server.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/greet');
    });
  }
});

// Greets Current User
server.get('/greet', (req, res) => {
  const { name } = req.session;
  res.send(`hello ${name}`);
});

module.exports = { server };
