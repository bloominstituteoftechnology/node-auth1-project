const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const User = require('./user.js');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(
  session({
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  })
);

//local middleware
const protected = function(msg) {
  return function(req, res, next) {
    if (req.session && req.session.name) {
      User.findOne({ username: req.session.name })
        .then((user) => {
          req.user = user;
          next();
        })
        .catch((err) => sendUserError(err, res));
    } else {
      sendUserError({ message: 'You are not logged in' }, res);
    }
  };
};

server.use(express.json()); //global middleware

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
server.post('/users', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    // return res.status(422).json({ err: 'You must enter a valid username and password' });
    return sendUserError('Enter valid username and password', res);
  const user = new User({ username, passwordHash: password });
  user
    .save()
    .then((savedUser) => res.status(200).json(savedUser))
    .catch((err) => res.status(500).json({ err: 'Server is not connected' }));
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  if (!username) return sendUserError('Enter valid username and password', res);
  User.findOne({ username })
    .then((response) => {
      if (response) {
        // user is a truthy value obj then run code
        response
          .isPasswordValid(password)
          .then((response) => {
            if (response) {
              req.session.name = username;
              res.status(200).json({ success: true });
            } else {
              res.status(422).json({ err: "Password didn't match" });
            }
            // response
            //   ? res.status(200).json({ success: true })

            //   : res.status(422).json({ err: "Password didn't match" });
          })
          .catch((err) => {
            console.log(err.message, 'err message');
            res.status(422).json({ err: "Couldn't check password" });
          });
      } else {
        // when user is null falsey statement
        res.status(422).json({ err: 'User is null' });
      }
    })
    .catch((err) => res.status(500).json({ err: 'Server is not connected' }));
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', protected('please login before proceeding'), (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
