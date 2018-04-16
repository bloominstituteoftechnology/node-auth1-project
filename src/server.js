const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const User = require('./user');

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
const options = {
  useMongoClient: true,
  autoIndex: false,
  reconnectTries: Number.MAX_VALUE, 
  reconnectInterval: 500, 
  poolSize: 10, 
  bufferMaxEntries: 0
}

mongoose
  .connect('mongodb://localhost/authDB', options)
  .then(() => {
    console.log('\n=== connected to MongoDB ===\n');
  })
  .catch(err => console.log('database connection failed', err));

// TODO: add local middleware to this route to ensure the user is logged in

const authenticate = function(req, res, next) {
  req.hello = `hello ${user}`;

  next();
};

server.use(express.json());

server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
