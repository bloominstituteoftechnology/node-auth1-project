const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');

const User = require('./user.js'); // <~~~ I put this here
const bcrypt = require('bcrypt');  // <~~~ I put this here

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
// express-session deprecated undefined resave option; provide resave option src/server.js:15:12
// express-session deprecated undefined saveUninitialized option; provide saveUninitialized option src/server.js:15:12
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  // https://github.com/expressjs/session/issues/56
  // https://github.com/expressjs/session#options
  resave: true,
  saveUninitialized: false,
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

// GLOBAL MIDDLEWARE
server.use((req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    sendUserError('Please enter BOTH a USERNAME and a PASSWORD.', res);
    return;
  }
  // req.body.username = username;
  // req.body.password = password;
  next();
});

// // LOCAL MIDDLEWARE
// const validateNameAndPassword = ((req, res, next) => {
//   const { username, password } = req.body;
//   if (!username || !password) {
//     sendUserError('Please enter BOTH a USERNAME and a PASSWORD.', res);
//     return;
//   }
//   // req.body.username = username;
//   // req.body.password = password;
//   next();
// });

// ROUTES
server.post('/users', (req, res) => {
// LOCAL MIDDLEWARE IMPLEMENTATION
// server.post('/users', validateNameAndPassword, (req, res) => {
  // The `POST /users` route expects two parameters: `username` and `password`.
  const { username, password } = req.body;
  const newUser = { username, password };
  // const newUser = { req.body.username, req.body.password }
  // const newUser = { username: req.body.username, password: req.body.password };
  // When the client makes a `POST` request to `/users`, hash the given password
  bcrypt.hash(newUser.password, BCRYPT_COST, (err, hash) => {
    // console.log('Hash:', hash);
    if (err) {
      // throw err;
      sendUserError(err, res);
    }
    newUser.passwordHash = hash;
  });
  // and create a new user in MongoDB. Send the user object as a JSON response.
  // console.log('newUser', newUser);
  const user = new User(newUser);
  // console.log('user', user);
  // console.log('user.username', user.username);
  // console.log('user.password', user.password);
  // console.log('user.passwordHash', user.passwordHash);
  user.save((err) => {
    if (err) {
      sendUserError({ 'Error inserting a new user into users database': err.message, 'ERROR STACK': err.stack }, res);
      // res.status(STATUS_USER_ERROR);
      // res.send({ 'Error inserting new user into users database: ': err.message });
      return;
    }
    res.json(user);
  });
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

// server.get('/view-counter', (req, res) => {
//   const session = req.session;
//   if (!session.viewCount) {
//     session.viewCount = 0;
//   }
//   session.viewCount++;
//   res.json({ viewCount: session.viewCount })
// });

module.exports = { server };
