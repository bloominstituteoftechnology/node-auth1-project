const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./User.model');
const routerFactory = require('../myTools/RouterFactoryClass');

const userRouter = express.Router();

const UserRouterFactory = new routerFactory(userRouter, User);
UserRouterFactory.sayHello('User');
UserRouterFactory.setProjection({ __v: 0 });

// Create a POST for /api/register
UserRouterFactory.POST('/register');
UserRouterFactory.GET('/register*', _404);

UserRouterFactory.POST('/login', handleLogin);
UserRouterFactory.GET('/login*', _404);

UserRouterFactory.GET('/logout', logout, _404);
UserRouterFactory.GET('/logout*', _404);

UserRouterFactory.GET('/users*', isLogged, 'handleGET');

/**
 * Router for: '/api/restricted/../../...'
 * Restric: any nested path
 */
UserRouterFactory.GET('/restricted*', isLogged, 'handleGET');

/**
 * Middlewares: custom route handlers
 */
function isLogged(req, res, next) {
  req.session.loggedIn ? next() : res.status(401).json('You must be logged in!');
}
function logout(req, res, next) {
  !req.session ? next() : delete req.session.loggedIn;
  res.status(200).json('Your session has been closed. See you soon!');
  // : req.session.destroy(err => {
  //     err
  //       ? res.status(500).json('We can not logged you out, please try again')
  //       : res.status(200).json('Your session has been closed. See you soon!');
  // });
}
function handleLogin(req, res, next) {
  if (req.session.loggedIn) return res.send('You are already logged in!');
  const { username, password } = req.body;
  User.findOne({ username }, function(err, user) {
    console.log(user);
    err && res.status(500).json('Something bad happend processing your ligin, try again');
    !user && res.status(401).json('Information no valid');

    user
      .passValidation(password)
      .then(matchedPass => {
        if (!matchedPass) return res.status(401).json('Information no valid');

        // req.session.username = user.username;
        req.session.loggedIn = true;
        req.session.anotherCookie = 'anotherCookie';
        res.status(200).json('You are loged in - with cookie');
      })
      .catch(e => {
        res.status(500).json('Something bad happend processing your ligin, try again');
      });
  });
}
function _404(req, res) {
  res.status(404).json({ RESOURCE: '404 - Not found' });
}

module.exports = userRouter;
