/* eslint no-console: 0 */

const express = require('express');
const session = require('express-session');
const cors = require('cors');

const middleware = require('./middlewares');
const User = require('./user.js');

const STATUS_USER_ERROR = 422;

const server = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

server.use(cors(corsOptions));
server.use(express.json());
server.use(
  session({
    secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
    resave: true,
    saveUninitialized: false,
  })
);

server.use('/restricted', middleware.restrictedAccess);

server.post('/users', (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({ username, passwordHash: password });
  newUser
  .save()
  .then(user => res.status(200).send(user))
  .catch(err => middleware.sendUserError(err, res));
});

server.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username)
    return middleware.sendUserError({ Error: 'Must enter username' }, res);
  if (!password)
    return middleware.sendUserError({ Error: 'Must enter password' }, res);
  const lowerCaseUsername = username.toLowerCase();
  User.findOne({ username: lowerCaseUsername })
    .then(foundUser => {
      if (foundUser === null) {
        middleware.sendUserError(
          { Error: 'Must use valid username/password' },
          res
        );
      } else {
        foundUser
          .checkPassword(password)
          .then(validated => {
            if (validated) {
              req.session.username = foundUser.username;
              res.status(200).send({ success: true });
            } else {
              middleware.sendUserError(
                { Error: 'Must use valid username/password' },
                res
              );
            }
          })
          .catch(err => {
            return middleware.sendUserError(err);
          });

        // foundUser.checkPassword(password, (err, validated) => {
        //   if (err) {
        //     return middleware.sendUserError(err);
        //   } else if (!validated) {
        //     middleware.sendUserError({ Error: 'Must use valid username/password' }, res);
        //   } else if (validated) {
        //     req.session.username = foundUser.username;
        //     res.status(200).send({ success: true });
        //   }
        // });
      }
    })
    .catch(err => middleware.sendUserError(err, res));
});

server.get('/restricted/users', (req, res) => {
  User.find({})
    .then(results => res.status(200).send(results))
    .catch(err => middleware.sendUserError(err, res));
});

server.post('/logout', (req, res) => {
  if (!req.session.username)
    return middleware.sendUserError('User is not logged in', res);
  req.session.username = null;
  // req.session.destroy; // better option probably
  res.send(req.session);
});

server.get('/restricted/hello', (req, res) => {
  res.send('Hello world');
});

server.get('/me', middleware.authenticateUserMW, (req, res) => {
  res.json(req.user);
});

module.exports = { server };
