const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
const restricted = express.Router();

const User = require('./user');
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    url: 'mongodb://localhost/users',
    ttl: 14 * 24 * 60 * 60
  })
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
server.post('/users', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return sendUserError('Please fill in all fields', res);
  const newUser = new User();
  newUser.username = username;
  newUser.passwordHash = newUser.generateHash(password);
  newUser.save((err, user) => {
    return err ? sendUserError(err, res) : res.json(user);
  });
});

server.post('/log-in', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return sendUserError('Please fill in all fields', res);
  User.findOne({ username })
    .exec()
    .then((user) => {
      if (!user) return sendUserError('This account does not exist', res);
      if (user.validPassword(password)) {
        req.session.user = user.id;
        // to pass tests...
        req.session.userObj = user;
        res.json({ success: true });
      } else {
        return sendUserError('Incorrect credentials. Please try again.', res);
      }
    })
    .catch(err => sendUserError(err, res));
});

// TODO: add local middleware to this route to ensure the user is logged in
const isLoggedIn = (req, res, next) => {
  req.user = req.session.userObj;
  return req.session.user ? next() : sendUserError('You are not authorized to view this page', res);
};
server.get('/me', isLoggedIn, (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});
server.use('/restricted', isLoggedIn, restricted);
restricted.get('/users', (req, res) => {
  User.find()
    .exec()
    .then((users) => {
      return users ? res.json(users) : sendUserError('There are no users on the server... weird right?', res);
    })
    .catch(err => sendUserError('Server error retrieving users', res));
});
restricted.delete('/users', (req, res) => {
  User.remove({ _id: { $not: req.user.id } }, (err, result) => {
    return err ? sendUserError('Server error trying to delet the users.', res) : res.json(result);
  });
});
restricted.get('/users/:id', (req, res) => {
  User.findById(req.params.id)
    .exec()
    .then(user => user ? res.json(user) : sendUserError('This user does not exist in the system', res))
    .catch(err => sendUserError('Server error retrieving this user account.', res));
});

module.exports = { server };
