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
UserRouterFactory.POST('/login', login);
UserRouterFactory.GET('/users', ifLoggedGET, 'handleGET');

/**
 * Middlewares: custom route handlers
 */
function ifLoggedGET(req, res, next) {
  req.session.loggedIn ? next() : res.status(401).json('You must be logged in!');
}
function login(req, res, next) {
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

        req.session.loggedIn = user.username;
        req.session.anotherCookie = 'anotehrCookie';
        res.status(200).json('You are loged in - with cookie');
      })
      .catch(e => {
        res.status(500).json('Something bad happend processing your ligin, try again');
      });
  });
}

module.exports = userRouter;
