const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const User = require('./user.js');

mongoose.connect('mongodb://localhost/authDB', { useMongoClient: true });

const server = express();

server.use(express.json());
server.use(
  session({
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
    resave: true,
    saveUninitialized: true
  })
);

/* Sends the given err, a string or an object, to the client. Sets the status
 * code appropriately. */
const sendUserError = (err, res) => {
  res.status(422);
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack });
  } else {
    res.json({ error: err });
  }
};

const isLoggedIn = function (req, res, next) {
  if (!req.session.auth) res.status(422).json('not allowed');
  if (req.session.name) {
    User.findOne({ username: req.session.name.toLowerCase() })
      .then((user) => {
        req.user = user;
        next();
      })
      .catch(error => res.status(500).json(error));
  }
};

server.post('/users', (req, res) => {
  if (!(req.body.username && req.body.password)) {
    res.status(422).json({ error: 'provide username and password' });
  } else {
    User.create({
      username: req.body.username,
      passwordHash: req.body.password
    })
      .then(saved => res.status(200).json(saved))
      .catch(error => res.status(500).json(error));
  }
});

server.post('/log-in', (req, res) => {
  if (!(req.body.username && req.body.password)) {
    res.status(422).json({ error: 'provide username and password' });
  } else {
    User.findOne({ username: req.body.username.toLowerCase() })
      .then((user) => {
        if (user) {
          user
            .isPasswordValid(req.body.password)
            .then((response) => {
              if (response) {
                req.session.auth = true;
                req.session.name = req.body.username;
                res.status(200).json({ success: true });
              } else res.status(422).json({ success: false });
            })
            .catch(error => res.status(422).json({ success: false }));
        } else res.status(422).json('not found');
      })
      .catch(error => res.status(500).json(error));
  }
});

server.get('/me', isLoggedIn, (req, res) => {
  res.json(req.user);
});

server.listen(5000);

module.exports = { server };
