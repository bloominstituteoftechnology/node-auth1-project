const bcrypt = require('bcrypt');

const BCRYPT_COST = 11;

// Catches async/await errors/Promise rejections and passes it along to express middleware
const catchErrors = fn => (req, res, next) => fn(req, res, next).catch(next);

// 404 Handler
const notFound = (req, res, next) => {
  const err = new Error('🚫 Not Found');
  err.status = 404;
  next(err);
};

// MongoDB Validation Error Handler (i.e., blank username/password field, existing user, etc.)
const validationErrors = (err, req, res, next) => {
  if (!err.errors) return next(err);
  res.status(err.status || 422).json({ Error: `🚫 ${err.message}` });
};

// Error Handler (displays full error details if in development env)
const handleErrors = (err, req, res, next) => {
  err.stack = err.stack || '';
  const errorDetails = {
    status: err.status,
    message: err.message,
    stack: err.stack
  };
  res.status(err.status || 500).json(errorDetails);
};

// Sends error message to client
const sendError = (status, message, res) =>
  res.status(status).json({ Error: `🚫 ${message}` });

// Extra Credit: global middleware that ensures a user is logged in when
const loggedIn = (req, res, next) => {
  if (!req.session || !req.session.user) sendError(422, 'Must be logged in', res);
  req.user = req.session.user;
  next();
};

const hashPass = password => bcrypt.hash(password, BCRYPT_COST);

const comparePass = (password, hash) => bcrypt.compare(password, hash);

module.exports = {
  catchErrors,
  notFound,
  validationErrors,
  handleErrors,
  sendError,
  loggedIn,
  hashPass,
  comparePass
};
