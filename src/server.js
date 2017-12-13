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
server.use(
  session({
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
    resave: true,
    saveUninitialized: false,
  }),
);

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

/* ************ MiddleWares ***************** */

const hashedPassword = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    sendUserError('Give me password!', res);
    return;
  }
  bcrypt
    .hash(password, BCRYPT_COST)
    .then((pw) => {
      req.password = pw;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
};

const authenticate = (req, res, next) => {
  const { username, password } = req.body;
  if (!username) {
    sendUserError('username undefined', res);
    return;
  }
  User.findOne({ username }, (err, user) => {
    if (err || user === null) {
      sendUserError('No user found at that id', res);
      return;
      // res.status(422);
      // res.json({ 'Need both username/password fields': err.message });
      // return;
    }
    const hashedPw = user.passwordHash;
    bcrypt
      .compare(password, hashedPw)
      .then((response) => {
        if (!response) throw new Error();
        req.loggedInUser = user;
        next();
      })
      .catch((error) => {
        return sendUserError('some message here', res);
        // if (error) {
          // res.status(422).json({ 'Authentication failed!': err1.message });
          // return;
      }
    );
  });
};

/* ************ MiddleWares ***************** */

server.post('/users', hashedPassword, (req, res) => {
  const { username } = req.body;
  const passwordHash = req.password;

  // if (!password) sendUserError({ error: 'no password' }, res);
  // bcrypt
  //   .hash(password)
  //   .then((passwordHash) => {
  const newUser = new User({ username, passwordHash });

  newUser.save((err, savedUser) => {
    if (err) {
      res.status(422);
      res.json({ 'Need both Username/Password fields': err.message });
      return;
    }
    res.json(savedUser);
  });
        // .save()
        // .then(nUser => res.json(nUser))
        // .catch(err => sendUserError(err, res));
    // .catch(err => sendUserError(err, res));
});

// server.post('/users', hashedPassword, (req, res) => {
//   const { username } = req.body;
//   const passwordHash = req.password;
//   const newUser = new User({ username, passwordHash });
//   newUser.save((err, savedUser) => {
//     if (err) {
//       res.status(422);
//       res.json({ 'Save failed!': err.message });
//       return;
//     }
//     res.json(savedUser);
//   });
// });

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    if (req.session.username) res.json({ success: true });
  }
  User
    .findOne({ username })
    .then((user) => {
      bcrypt
        .compare(password, user.passwordHash)
        .then((result) => {
          if (!result) sendUserError('incorrect username/password', res);
          req.session.username = username;
          res.json({ success: result });
        })
        .catch(err => sendUserError(err, res));
    })
    .catch(err => sendUserError(err, res));
});

// server.post('/user/login', authenticate, (req, res) => {
//   res.json({ success: `${req.loggedInUser.username} logged in` });
// });

// TODO: add local middleware to this route to ensure the user is logged in
// server.get('/me', (req, res) => {
  // if (!req.query.username || !req.query.password) {
  //   res.send('login failed');
  // } else if(req.query.username === username || req.query.password === password) {
  //   req.session.user = username;
  //   res.send("login success!");
  // }

const meMiddleWare = (req, res, next) => {
  const { username } = req.session;
  if (username === undefined) sendUserError('not logged in', res);

  User
    .findOne({ username })
    .then((fUser) => {
      req.user = fUser;
      next();
    })
  .catch(err => sendUserError(err, res));
};

server.get('/me', meMiddleWare, (req, res) => {
// Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
