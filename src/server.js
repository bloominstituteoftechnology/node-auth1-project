const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
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

server.get('/users', (req, res) => {
  User.find()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// TODO: implement routes
server.post('/users', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res
      .status(422)
      .json({ message: 'User Error: Username and Password required.' });
  } else {
    const { username, password } = req.body;
    // const user = new User(req.body);
    const user = new User({ username, passwordHash: password });

    user
      .save()
      .then((savedUser) => {
        res.status(200).json(savedUser);
      })
      .catch((err) => {
        res.status(500).json(sendUserError(err, res));
      });
  }
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then((user) => {
      if (user) {
        if (user.isPasswordValid(password)) {
          res.status(200).json({ success: true });
        }
      }
    })
    .catch((err) => {
      res.status(500).json(sendUserError(err, res));
    });
});
// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
