const express = require('express');
const session = require('express-session');

const User = require('./user.js');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
}));

const authenticate = function (req, res, next) {
  req.hello = `hello ${User}!`;

  next();
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

server.post('/users', (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, passwordHash: password });

  user
    .save()
    .then(savedUser => {
      res.status(200).json(savedUser);
    })
    .catch((err) => {
      sendUserError(err, res);
    });
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, passwordHash: password });

  User
    .findOne({ username })
    .then((user) => {
      
      user.comparePassword(passwordHash, (err, isMatch) => {
        if (err) throw err;
        if (!isMatch) sendUserError('invalid credentials', res);
        res.status(200).json(isMatch);
      });
    })
    .catch((err) => {
      sendUserError(err, res);
    });
});


// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

server.get('/', (req, res) => {
  User.find()
  .then(users => {
      res.status(200).json(users);
  })
    .catch((err) => {
      sendUserError(err, res);
});
const user = new User({ username, passwordHash: password });

module.exports = { server };
