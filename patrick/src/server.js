const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');

const User = require('./user');    // <~~~ added
const bcrypt = require('bcrypt');  // <~~~ added
const path = require('path');      // <~~~ added

const STATUS_USER_ERROR = 422;
const STATUS_SERVER_ERROR = 500;   // <~~~ added
const BCRYPT_COST = 11;

const server = express();

server.use(bodyParser.json());

// express-session deprecated undefined resave option; provide resave option src/server.js:19:12
// express-session deprecated undefined saveUninitialized option; provide saveUninitialized option src/server.js:19:12
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  // https://github.com/expressjs/session/issues/56
  // https://github.com/expressjs/session#options
  resave: true,
  saveUninitialized: false,
}));

// HELPER FUNCTIONS
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


// LOCAL MIDDLEWARE TO CREATE A NEW USER
const validateNameAndPassword = ((req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    sendUserError('Please enter BOTH a USERNAME and a PASSWORD.', res);
    return;
  }
  next();
});
server.post('/users', validateNameAndPassword, (req, res) => {
  const { username, password } = req.body;
  const passwordHash = bcrypt.hashSync(password, BCRYPT_COST, (err, hash) => {
    if (err) { // <~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ WHAT COULD CAUSE AN ERROR HERE?
      sendServerError({ 'That password broke us :_(': err.message, 'ERROR STACK': err.stack }, res);
      return;
    }
  });
  new User({ username, passwordHash })
  .save((error, user) => {
    if (error) { // https://youtu.be/frIA7tuBqqY
      sendUserError({ [`Jigga What? Jigga Who??? The name "${username}" is already taken.`]: error.message, 'ERROR STACK': error.stack }, res);
      return;
    }
    res.json(user);
  });
});
// LOGIN IN A "REGISTERED" USER
server.post('/log-in', validateNameAndPassword, (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username })
  .exec()
  .then((user) => {
    if (user === null) {
      sendUserError(`Who are you??? I don't know no ${username}! Please go to /users and create an account`, res);
    } else {
      bcrypt.compare(password, user.passwordHash, (error, isValid) => {
        if (error) { // <~~~~~~~~~~~~~~~~~~~~~~~~ WHAT COULD CAUSE AN ERROR HERE?
          sendServerError({ 'Yeah.... no': error }, res);
          return;
        }
        if (!isValid) {
          sendUserError({ 'That password just aint right!': error }, res);
        } else {
          req.session.user = user;
          res.json({ success: true });
        }
      });
    }
  })
  .catch((err) => {
    sendUserError({ 'CAUGHT RED HANDED!!!': err.message, 'ERROR STACK': err.stack }, res);
  });
});


// LOCAL MIDDLEWARE TO DISPLAY THE SESSION USER
const userAuthMiddleware = (req, res, next) => {
  if (req.session.user === undefined) {
    sendUserError('yoYOyo-yo!!! You gots to LOG IN, bruh!!!', res);
  } else {
    req.user = req.session.user;
    next();
  }
};
server.get('/me', userAuthMiddleware, (req, res) => {
  res.json(req.user);
});


// GLOBAL MIDDLEWARE for EXTRA CREDIT
server.use((req, res, next) => {
  if (req.path.match(/restricted\/[\S]/)) { // <~~~~~~~~~~ props to Ely!!!!!!!!
    const sessionUserName = req.session.user.username;
    if (!req.session.user) {
      sendUserError('Who do you think you are????!!!???', res);
      return;
    }
    res.json(`Well, hello there ${sessionUserName}. Welcome to the InterZone.`);
  }
  next();
});


// DEMONSTRATING INDEPENDENT CLIENT SESSIONS
server.get('/view-counter', (req, res) => {
  const sehShun = req.session;
  // console.log(sehShun);
  if (!sehShun.viewCount) {
    sehShun.viewCount = 0;
  }
  sehShun.viewCount++;
  res.json({ viewCount: sehShun.viewCount });
});

module.exports = { server };
