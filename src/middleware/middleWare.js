const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
// const sendUserError = require('../errorhelper.js');

const SALT_WORK_FACTOR = 11;
const STATUS_USER_ERROR = 422;


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
exports.User.passwdBcrypt = (req, res, next) => {
  const { password } = req.body;

    // only hash the password if it has been modified (or is new)
  if (!password) {
    sendUserError('Password is required', res);
    return;
  }
    // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);

        // hash the password using our new salt
    bcrypt.hash(User.password, salt, (hash) => {
      if (err) return next(err);

            // override the cleartext password with the hashed one
      req.body = hash;
      next();
    });
  });
};

exports.comparePassword = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err) {
      res.status(422).json(err);
      return;
    }
    const hashedpw = User.password;
    bcrypt.compare(password, User.password)
        .then((error) => {
          if (!res) throw new Error();
          req.user = user.email;
          next(error);
        })
          .catch((error) => {
            res.status(422).json(err);
          });
  });
};
