const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');

const User = require('./user.js');

mongoose
  .connect("mongodb://localhost/authdb")
  .then(conn => console.log("... API Connected to Database ..."))
  .catch(err => console.log("*** ERROR Connecting to Database ***", err));
const server = express();

server.use(express.json());
server.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

const corsOptions = {
  origin: 'http://localhost:5000',
  credentials: true
};
server.use(cors(corsOptions));

const isLoggedIn = function (req, res, next) {
  if (!req.session.auth) res.status(422).json('You Shall Not Pass');
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
  if (/restricted/.test(req.url)) {
    if (!req.session.auth) res.status(422).json('You Shall Not Pass');
    else next();
  } else next();
};

server.use(isRestricted);

server.post('/users', (req, res) => {
  if (!(req.body.username && req.body.password)) {
    res.status(422).json({ error: 'Insert Username and Password' });
  } else {
    User.create({
      username: req.body.username.toLowerCase(),
      passwordHash: req.body.password
    })
      .then(saved => res.status(200).json(saved))
      .catch(error => res.status(500).json(error));
  }
});

server.post('/login', (req, res) => {
  if (!(req.body.username && req.body.password)) {
    res.status(422).json({ error: 'Insert Username and Password' });
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
        } else res.status(422).json('Not Found');
      })
      .catch(error => res.status(500).json(error));
  }
});

server.post('/logout', (req, res) => {
  req.session.regenerate(err => res.json(err));
  res.status(200).json('Logged Out');
});

server.get('/me', isLoggedIn, (req, res) => {
  res.json(req.user);
});

server.get('/restricted/users', (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).json(users);
    })
    .catch(error => res.status(500).json('Try Harder'));
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server up and running on ${port}`);
});

module.exports = { server };