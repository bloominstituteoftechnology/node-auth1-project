const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');

const STATUS_USER_ERROR = 422;

const User = require('./user.js');

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(
  session({
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
    resave: true,
    saveUninitialized: false,
  })
);

// Stretch problem global middleware
const restrictedAccess = (req, res, next) => {
  const session = req.session;
  if (session.UA === req.headers['cookie']) next();
  else res.status(404).send({ msg: 'You must log in to view this page.' });
};

// Stretch problem solution line which pairs with restrictedAccess on line 22
server.use('/restricted', restrictedAccess);

const authenticateUserMW = (req, res, next) => {
  const session = req.session;
  console.log(session.UA);
  console.log(req.headers['cookie']);
  if (session.UA === req.headers['cookie']) {
    User.findOne({ username: session.username })
      .then(foundUser => {
        req.user = foundUser;
        next();
      })
      .catch(err => sendUserError(err, res));
  } else {
    res.status(500).send({ errorMessage: 'You are not logged in.' });
  }
};

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
  const newUser = new User({ username, passwordHash: password });
  newUser
    .save()
    .then(savedUser => res.status(201).send(savedUser))
    .catch(err => sendUserError(err, res));
});

server.post('/log-in/:username&:password', (req, res) => {
  const { username, password } = req.params;
  User.findOne({ username: username })
    .then(foundUser => {
      if (foundUser === null)
        res.status(404).send({ Error: 'Must use valid username/password' });
      else {
        foundUser.checkPassword(password, (err, validated) => {
          if (err) return sendUserError(err);
          else if (!validated)
            res.status(404).send({ Error: 'Must use valid username/password' });
          else if (validated) {
            const session = req.session;
            session.username = username;
            session.UA = req.headers['cookie'];
            console.log(session.UA);
            console.log(req.headers['cookie']);
            res.status(500).send({ success: true });
          }
        });
      }
    })
    .catch(err => sendUserError(err, res));
});

server.get('/dev', (req, res) => {
  User.find({})
    .then(results => res.status(200).send(results))
    .catch(err => sendUserError(err, res));
});

server.get('/restricted/hello', (req, res) => {
  res.send('Hello world');
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', authenticateUserMW, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
