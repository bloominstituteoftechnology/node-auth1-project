const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./user.js');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
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

// Middlewares
const hashedPassword = (req, res, next) => {
  const { passwordHash } = req.body;
  bcrypt
    .hash(passwordHash, 11)
    .then((pw) => {
      req.passwordHash = pw;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
};

const authenticate = (req, res, next) => {
  const { username, passwordHash } = req.body;
  User.findOne({ username })
    .then((user) => {
      const hashedPw = user.passwordHash;
      bcrypt
        .compare(passwordHash, hashedPw)
        .then((pw) => {
          if (!pw) {
            throw new Error();
          }
          req.loggedUser = user.username;
          next();
        })
        .catch((err2) => {
          return sendUserError('Unknown error', res);
        });
    })
  .catch((err) => {
    res.status(422).json(err);
  });
};

// TODO: implement routes
server.post('/users', hashedPassword, (req, res) => {
  const { username } = req.body;
  const passwordHash = req.passwordHash;
  const newUser = new User({ username, passwordHash });
  newUser
    .save()
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(422).json({ error: err.message });
      return;
    });
});

server.get('/users', (req, res) => {
  User.find({})
    .then((user) => {
      res.status(422).json(user);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

server.delete('/users/:user_id', (req, res) => {
  const { user_id } = req.params;
  User.findById({ _id: user_id })
    .then((user) => {
      user.remove();
      res.status(422).json({ success: true });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});
server.post('/user/login', authenticate, (req, res) => {
  res.status(200).json({ sucess: `${req.loggedUser} has successfully logged in.` });
});
// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', authenticate, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
