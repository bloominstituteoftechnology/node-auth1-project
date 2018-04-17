const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const User = require('./user.js');

mongoose.connect('mongodb://localhost/authDB', { useMongoClient: true });

const server = express();

server.use(express.json());
server.use(
  session({
    secret: 'shhhhhhh its a secret',
    resave: true,
    saveUninitialized: true
  })
);

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

const isRestricted = function (req, res, next) {
  if (/required/.test(req.url)) {
    if (!req.session.auth) res.status(422).json('not allowed');
    else next();
  } else next();
};

server.use(isRestricted);

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

server.get('/required/greeting', (req, res) => {
  res.status(200).json(`hello ${req.session.name}`);
});

server.listen(5000);

module.exports = { server };
