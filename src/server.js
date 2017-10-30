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
// Session middleware
server.use(session({
  // Secret for session
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


/* userData middleware */
const userData = (req, res, next) => {
  next();
};

/* timeOut middleware */
server.use((req, res, next) => {
  // Skip it no user object
  if (!('user' in req.session)) {
    return next();
  }
  // check time
  if ( req.session.user.expires <= Date.now() ) {
    delete req.session.user;
  } else {
    req.session.user.expires = Date.now() + (1000 * 50 * 5);
  }
  next();
});


server.post('/users', (req, res) => {
  const { username, password } = req.body;
  // verify both properties sent
  if (!username || !password) return sendUserError('undefined: username || password', res);
  // Encrypt password
  // Start hashing
  bcrypt.hash(password, BCRYPT_COST, (err, hash) => {
    // catch err
      if (err) return sendUserError('Error processing. Please try again', res);
    // Make new user
    const newUser = new User({ username, passwordHash: hash });
    // save
    newUser.save()
    // success
    .then((u) => {
      if (!u._id) return sendUserError('Unable to create new user.');
      res.json(u);
    })
    // error
    .catch(e => sendUserError(e, res));
  });
});


server.post('/log-in', (req, res) => {
  // get username and password from the request
  const { username, password } = req.body;
  // get user from session
  const { user } = req.session;
  // if the username or password from the request is missing...
  if (!username, !password) return sendUserError('undefined: username || password', res);
  // get hashed password
  User.findOne({ username })
  .then((u) => {
    if (u === null) {
      console.log('No user found');
      return sendUserError('username or password error.');
    }
    bcrypt.compare(password, u.passwordHash, (err, result) => {
      if (err) {
        console.log(err);
        sendUserError(err, res);
      }
      // If password mismatch
      if (result === false) return sendUserError({ success: result, message: 'wrong password' }, res);
      // Set session
      req.session.user = { username, expires: Date.now() + (1000 * 60 * 5)  };
      // Send result
      res.json({ success: result });
    });
  })
  .catch(err => sendUserError(err, res));
});


// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res, next) => {
  if (!req.session.user) return sendUserError({ error: 'Not signed in' }, res);
  User.findOne({ username: req.session.user.username })
  .then((u) => {
    if (u === null) return sendUserError({ error: 'illegal user session' }, res);
    req.user = u;
    next();
  })
  .catch((err) => {
    return sendUserError(err, res);
  });
}, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
