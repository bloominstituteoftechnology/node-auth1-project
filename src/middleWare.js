const User = require('./user');
const bcrypt = require('bcrypt');

/* Sends the given err, a string or an object, to the client. Sets the status
 * code appropriately. */
const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

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
    sendUserError('Gimme a password', res);
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

const loggedIn = (req, res, next) => {
  const { username } = req.session;
  console.log(req.session);
  if (!username) {
    sendUserError('User is not logged in', res);
    return;
  }
  User.findOne({ username }, (err, user) => {
    if (err) {
      sendUserError(err, res);
    } else if (!user) {
      sendUserError('User does exist', res);
    } else {
      req.user = user;
      next();
    }
  });
};

const restrictedPermissions = (req, res, next) => {
  const path = req.path;
  if (/restricted/.test(path)) {
    if (!req.session.username) {
      sendUserError('user not autorized', res);
      return;
    }
  }
  next();
};

module.exports = {
  sendUserError,
  hashedPassword,
  loggedIn,
  restrictedPermissions,
};