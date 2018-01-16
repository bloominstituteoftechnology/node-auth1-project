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

// TODO: implement routes
const hashPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 11);
    req.body.password = hashedPassword;
    next();
  } catch (e) {
    sendUserError(e, res);
  }
};

const authenticate = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).exec();
    if (!user) {
      throw new Error('Failed to authenticate');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) { throw new Error('Failed to authenticate'); }
    req.authenticated = true;
    req.session.user = user.username;
    console.log(valid, user);
    next();
  } catch (error) {
    sendUserError(error, res);
  }
};
const withUser = async (req, res, next) => {
  try {
    const { user: username } = req.session;
    if (username) {
      const user = await User.findOne({ username }).lean().exec();
      if (!user) throw new Error('Failed to get user');
      req.user = user;
      // console.log('user: ', user);
      next();
      return;
    }
    throw new Error('Failed to get user: ');
  } catch (error) {
    sendUserError(error, res);
  }
};
// TODO: implement routes
server.post('/users', hashPassword, async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.create({ username, password });
    await user.save();
    res.json(user);
  } catch (e) {
    sendUserError(e, res);
  }
});

server.post('/log-in', authenticate, async (req, res) => {
  res.json({ success: true });
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

server.post('/logout', (req, res) => {
  if (!req.session.user) {
    sendUserError('User is not logged in ', res);
    return;
  }
  req.session.user = null;
  res.json(req.session);
});

module.exports = { server };
