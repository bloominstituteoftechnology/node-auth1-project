const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./user');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(
  session({
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
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

server.post('/users', async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!password) {
      throw new Error('Password is required!');
    }
    const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
    const user = await new User({ username, passwordHash }).save();
    return res.json(user);
  } catch (error) {
    return sendUserError(error, res);
  }
});

server.post('/log-in', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    const authenticated = await bcrypt.compare(password, user.passwordHash);
    if (!authenticated) {
      throw new Error('Incorrect password');
    }
    req.session.user = user.username;
    return res.json({ success: true });
  } catch (error) {
    return sendUserError(error, res);
  }
});

// TODO: add local middleware to this route to ensure the user is logged in
const checkAuth = async (req, res, next) => {
  if (!req.session.user) {
    return sendUserError('You are not logged in', res);
  }

  req.user = await User.findOne({ username: req.session.user });
  next();
};
server.get('/me', checkAuth, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
