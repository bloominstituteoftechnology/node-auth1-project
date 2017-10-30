const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const User = require('./user');

const STATUS_USER_ERROR = 422;

/* sendUserError
*  accepts: (err, req, res, next)
*  Sends the given err, a string or an object, to the client.
*  Sets the status code appropriately.
*/
const sendUserError = (err, req, res, next) => {
  res.status(STATUS_USER_ERROR);
  if (err && err.message) {
    res.send({ message: err.message, stack: err.stack });
  } else {
    res.send({ error: err });
  }
};

const requireUserAndPass = (req, res, next) => {
  // eslint-disable-next-line
  const user = { username, password } = req.body;
  // eslint-disable-next-line
  if (username === undefined || password === undefined) {
    return next({ error: 'Missing arguments', required: ['username, password'] });
  }
  req.user = user;
  next();
};

const authenticateUser = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next({ error: 'You must be logged in to do that!' });
  }
  User.findOne({ _id: req.session.user })
    .then((user) => {
      req.user = { user }.user;
      // req.user.passwordHash = undefined;
      next();
    })
    .catch(next);
};

/*
###env
base_url = 'http://localhost:3000'
###env
*/
const server = express();
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re'
}));
/*
get(base_url + '/restricted')
post(base_url + '/restricted', json= { "hi": "lol" })
put(base_url + '/restricted', json= { "hi": "lol" })
delete(base_url + '/restricted')
*/
server.use('/restricted*', authenticateUser);

server.get('/restricted', (req, res, next) => {
  res.send('Hey there');
});

/*
post(base_url + '/log-in', json = {
  "username": "jeff",
  "password": "123456"
})
*/
server.post('/log-in', requireUserAndPass, (req, res, next) => {
  User.findOne({ username: req.user.username })
    .then((user) => {
      user.checkPassword(req.user.password)
        .then((isPassword) => {
          if (!isPassword) {
            return next({ error: 'Incorrect password' });
          }
          req.session.loggedIn = true;
          // eslint-disable-next-line
          req.session.user = user._id;
          res.send({ success: true });
        })
        .catch(next);
    })
    .catch(next);
});

/*
post(base_url + '/log-out', json = {
  "username": "jeff",
  "password": "123456"
})
*/
server.post('/log-out', requireUserAndPass, (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }
    res.send({ success: true });
  });
});

/*
get(base_url + '/me')
*/
server.get('/me', authenticateUser, (req, res, next) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

/*
post(base_url + '/users', json = {
  "username": "jeff",
  "password": "123456"
})
*/
server.post('/users', requireUserAndPass, (req, res, next) => {
  new User({ username: req.user.username, passwordHash: req.user.password }).save()
    .then(user => res.send(user))
    .catch(next);
});

server.use(sendUserError);

module.exports = { server };
