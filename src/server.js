const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');

const User = require('./user.js');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
  })
);

const corsOptions = {
  "origin": "http://localhost:3000",
  "credentials": true
};
server.use(cors(corsOptions));

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


// ||||||||||||||||||||||||||||||||||
server.get('/users', (req, res) => {
  User.find()
  .then((users) => {
    res.status(200).json(users);
  })
  .catch((error) => {
    res.status(500).json(error);
  });
});
// ||||||||||||||||||||||||||||||||||

// TODO: implement routes
server.post('/users', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    sendUserError('no username or password', res);
  } else {
    const user = new User({ username, passwordHash: password });

    user
      .save()
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((error) => {
        sendUserError(error, res);
      });
  }
});

server.post('/login', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      //
      if (user) {
        user.isPasswordValid(password).then((isValid) => {

          console.log(username);
          // console.log(password);
          req.session.username = username;
          req.session.password = password;

          res.json({ success: true });
        });
      } else {
        sendUserError({ message: 'invalid username or password' }, res);
      }
    });
});

server.post('/logout', (req, res) => {
  let username = req.session.username;
  User.findOne({username}).then((user) => {
    if(user) {
      username = null;
      console.log(username);
      res.json(`${username} was logged out`);
    } else {
      sendUserError('Nothing to log out of', res);
    }
  })
})

// TODO: add local middleware to this route to ensure the user is logged in
const checkUser = function (req, res, next) {
  const username = req.session.username;
  if(!username) {
    sendUserError('No one is logged in...', res)
  }
  User.findOne ({username})
  .then((user) => {
    req.user = user;

    next();
  });
};

server.get('/me', checkUser, (req, res) => {
  // Do NOT modify this route handler in any way.

  res.json(req.user);
});

module.exports = { server };
