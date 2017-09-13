const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const User = require('./user.js');

const STATUS_USER_ERROR = 422;
const STATUS_SERVER_ERROR = 500;
const BCRYPT_COST = 11;

const server = express();

// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

server.use(session({
  // We've also gone ahead and initialized the express-session middleware so you can
  // use the client-specific, persistent `req.session` object in your route handlers.
  resave: true,
  saveUninitialized: false,
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
}));

const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack });
  } else {
    res.json({ error: err });
  }
};

const sendServerError = (err, res) => {
  res.status(STATUS_SERVER_ERROR);
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack });
  } else {
    res.json({ error: err });
  }
};

server.post('/users', (req, res) => {
  // ### `POST /users`
  // The `POST /users` route expects two parameters: `username` and `password`. When
  // the client makes a `POST` request to `/users`, hash the given password and
  // create a new user in MongoDB. Send the user object as a JSON response.
  const { username, password } = req.body;
  if (!username || !password) {
    let err;
    if (!username) {
      err = "You're missing your username.";
    } else {
      err = "You're missing your password.";
    }
    sendUserError(err, res);
  }

  // Use bcrypt to hash the password.
  bcrypt.hash(password, BCRYPT_COST, (err, hash) => {
    if (err) sendServerError(err, res);
    // Create a new user in MongoDB and save it.
    const user = new User({ username, passwordHash: hash });
    user.save((error) => {
      if (error) {
        sendServerError(error, res);
      } else {
        res.json(user);
      }
    });
  });
});

server.post('/log-in', (req, res) => {
  // ### `POST /log-in`
  // The `POST /log-in` route expects two parameters: `username` and `password`. When
  // the client makes a `POST` request to `/log-in`, check the given credentials and
  // log in the appropriate user. Send the object `{ success: true }` as a JSON
  // response if everything works out.

  // You'll need to use a session to track who is logged in. Do **NOT** store the
  // entire user object in the session; if the user in MongoDB gets updated or
  // deleted, the session will not reflect the changes. Instead, store some
  // information that will let you uniquely identify which user is logged in.

  // Make sure to do proper validation and error checking. If there's any error, or
  // if the credentials are invalid, respond with an appropriate status and error
  // message using the `sendUserError()` helper function.
  
  const { username, password } = req.body;
  if (!username || !password) {
    let error;
    if (!username) {
      error = "You're missing your username.";
    } else {
      error = "You're missing your password.";
    }
    sendUserError(error, res);
  }
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
