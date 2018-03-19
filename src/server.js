const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const User = require('./user.js');

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  authed: false,
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
server.post('/users/:username&:password', (req, res) => {
  const { username, password } = req.params;
  bcrypt.hash(password, BCRYPT_COST, (err, passwordHash) => {
    if (err) return sendUserError(err);
    const newUser = new User({username, passwordHash})
    newUser
      .save()
      .then((savedUser) => res.status(201).send(savedUser))
      .catch(err => sendUserError(err, res));
  })
})

server.post('/users/log-in/:username&:password', (req, res) => {
  const { username, password } = req.params;
  User.findOne({ username: username })
    .then(foundUser => {
      bcrypt.compare(password, foundUser.passwordHash, (err, passwordsMatch) => {
        console.log('The PW is:', password);
        console.log('The hash for user we are matching is:', foundUser);
        if (passwordsMatch) {
          const session = req.session;
          session.activeUser = username;
          session.authed = true;
          res.status(500).send({ success: true });
        } else {
          res.status(500).send({errorMessage: 'Passwords don\'t match!'});
        }
      })
    })
    .catch(err => sendUserError(err, res));
})

server.get('/users/dev', (req, res) => {
  User.find({})
    .then(results => res.status(200).send(results))
    .catch(err => sendUserError(err, res));
})

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
