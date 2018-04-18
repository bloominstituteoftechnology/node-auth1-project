const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const chalk = require('chalk');
const bcrypt = require('bcrypt');
const cors = require('cors');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const User = require('./user.js');

mongoose
  .connect('mongodb://localhost/data', { useMongoClient: true })
  .then(() => {
    console.log(chalk.whiteBright('\n=== Connected to MongoDb ===\n'));
  })
  .catch(error => console.log('Error Connecting to the database', error));

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
})
);

const corsOptions = {
  "origin": "http://localhost:3000",
  "credentials": true
};
server.use(cors(corsOptions));

const protected = (req, res, next) => {
  if (req.path.startsWith('/restricted')){
    if (req.session && req.session.username)
      next();
    else
      res.status(422).json({meg: 'You must be logged in to view this content.'});
  } else {
    next();
  }
}
server.use(protected);
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

const checkStatus = (req, res, next) => {
  if (req.session.username) {
    User.findOne({ username: req.session.username })
    .then((user) => {
      req.user = user;
      next();
    })
    .catch(err => res.status(500).json(err));
  } else {
    sendUserError({ message: 'NOT LOGGED IN' }, res);
  }
};

// TODO: implement routes

// function getHashedPassword(password) {
//   let hashedPassword = "0";
//   bcrypt.hash(password, 11, function(err, hash) {
//     console.log(hash);
//     if (hash) {
//       hashedPassword = hash;
//     }
//   });
//   return hashedPassword;
// }

// async function f1(password) {
//   return await getHashedPassword(password)
// }
server
  .post('/users', (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, passwordHash: password });
    user
      .save()
      .then(savedUser => res.status(200).json(savedUser))
      .catch(err => sendUserError(err, res));
  });
// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', checkStatus, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

server.post('/login', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username })
  .then((user) => {
    bcrypt.compare(password, user.passwordHash)
    .then((ans) => {
      if (ans) {
        req.session.username = username;
        res.status(200).json({ success: true });
      } else {
        sendUserError({ message: 'Passwords didn\'t match' }, res);
      }
    })
    .catch(err => sendUserError(err, res));
  })
  .catch(err => sendUserError(err, res));
});

server.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(function(err) {
      if (err) {
        res.status(500).json({ msg: 'could not log you out' });
      } else {
        res.status(200).json({ msg: 'good bye, come back soon' });
      }
    });
  }
});

module.exports = { server };
