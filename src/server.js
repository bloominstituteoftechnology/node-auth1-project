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



//==============================================================================
//                                MIDDLEWARE
//==============================================================================


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

const hashedPwd = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    res.status(400).json({ message: 'A password is required!' });
  }
  bcrypt
    .hash(password, BCRYPT_COST)
    .then(password => {
      req.password = password;
      next();
    })
    .catch(err => {
      res.status(500).sendUserError();
    });
};


//==============================================================================
//                                ROUTES
//==============================================================================

server.post('/users', hashedPwd, (req, res) => {
  const { username } = req.body;
  const passwordHash = req.password;
  const newUser = new User({ username, passwordHash });
  newUser
    .save()
    .then(obj => {
      res.status(200).json(obj);
    })
    .catch(err => {
      res.status(500).sendUserError();
    });
});



//==============================================================================
//                                SERVER INFORMATION
//==============================================================================


// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
