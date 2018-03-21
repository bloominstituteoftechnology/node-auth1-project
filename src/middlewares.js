const User = require('./user.js');
const STATUS_USER_ERROR = 422;

const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack });
  } else {
    res.json({ error: err });
  }
};

const restrictedAccess = (req, res, next) => {
  if (req.session.username) next();
  else res.status(404).send({ msg: 'You must log in to view this page.' });
};

const authenticateUserMW = (req, res, next) => {
  if (req.session.username) {
    User.findOne({ username: req.session.username })
      .then(foundUser => {
        req.user = foundUser;
        res.status(200);
        next();
      })
      .catch(err => sendUserError(err, res));
  } else {
    sendUserError({ Error: 'User must be logged in.' }, res);
  }
};

module.exports = {
  sendUserError,
  restrictedAccess,
  authenticateUserMW,
};
