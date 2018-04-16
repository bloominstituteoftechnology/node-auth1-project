const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const User = require('./user.js');

mongoose.connect('mongodb://localhost/authDB');

const server = express();

server.use(express.json());
server.use(
  session({
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
    resave: true,
    saveUninitialized: true
  })
);

// add local middleware to this route to ensure the user is logged in
const isLoggedIn = (req, res, next) => {
  if (!req.session.auth) res.status(500).json('not allowed');
  next();
};

server.post('/users', (req, res) => {
  if (!req.body.username && req.body.password) {
    res.status(400);
  } else {
    User.create(req.body)
      .then(saved => res.status(201).json(saved))
      .catch(error => res.status(500).json(error));
  }
});

server.post('/log-in', (req, res) => {
  if (!req.body.username && req.body.password) {
    res.status(400);
  } else {
    User.findOne({ username: req.body.username })
      .then((user) => {
        if (user) {
          user
            .isPasswordValid(req.body.password)
            .then((response) => {
              req.session.auth = true;
              res.status(200).json({ success: true });
            })
            .catch(error => res.status(400).json({ success: false }));
        }
      })
      .catch(error => res.status(500).json(error));
  }
});

server.get('/me', isLoggedIn, (req, res) => {
  res.json(req.user);
});

server.listen(5000, () => console.log('Server running'));
