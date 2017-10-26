const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const User = require('./user');
const bcrypt = require('bcrypt');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
}));
server.all('/restricted', (req, res, next) => {
  User.findOne({ username: session.username })
  .exec((err, user) => {
    if (err || !user || user.passwordHash !== session.password) return sendUserError("UNAUTHORIZED", res);
    req.user = {
      _id: user._id,
      username: user.username,
      passwordHash: user.passwordHash
    };
    next();
  });
});

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

const validateNewUser = (req, res, next) => {
  const { username, password } = req.body;
  if(!username || !password) return res.status(STATUS_USER_ERROR).json({ ERROR: 'USERNAME AND PASSWORD REQUIRED' });
  User.findOne({ username }).exec((notFound, found) => {
    if(notFound || found !== null ) res.status(STATUS_USER_ERROR).json({ ERROR: 'USERNAME ALREADY EXISTS' });
    req.username = username;
  }).catch(err => { if (err) return res.status(STATUS_USER_ERROR).json(err); });
  bcrypt.hash(password, 11, (err, hash) => {
    if (err) return sendUserError(err, res);
    req.password = hash;
    next();
  });
};

const validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) return sendUserError('USERNAME AND PASSWORD REQUIRD', res);
  User.findOne({ username })
  .exec((e, found) => {
    if (e || !found) return sendUserError(e, res);
    bcrypt.compare(password, found.passwordHash, (err, isSame) => {
      req.username = username;
      req.password = found.passwordHash;
      return isSame ? next() : sendUserError("WRONG PASSWORD", res);
    });
  });
};
server.post('/users', validateNewUser, (req, res) => {
  const username = req.username;
  const passwordHash = req.password;
  const user = new User({ username, passwordHash });
  user.save();
  res.json(user);
});

server.post('/log-in', validateLogin, (req, res) => {
  session.username = req.username;
  session.password = req.password;
  res.json({ success: true });
});

const checkLogin = (req, res, next) => {
  User.findOne({ username: session.username })
  .exec((err, user) => {
    if (err || !user || user.passwordHash !== session.password) return sendUserError(err, res);
    req.user = {
      _id: user._id,
      username: user.username,
      passwordHash: user.passwordHash
    };
    next();
  });
};
// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', checkLogin, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

server.post('/restricted', (req, res) => {
  res.json([req.user, { success: 'ACCESS GRANTED'}]);
});

module.exports = { server };
