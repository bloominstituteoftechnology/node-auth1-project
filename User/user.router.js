const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./User.model');
const routerFactory = require('../myTools/RouterFactoryClass');

const userRouter = express.Router();

const UserRouterFactory = new routerFactory(userRouter, User);
UserRouterFactory.sayHello('User');

// Create a POST for /api/register
UserRouterFactory.POST('/register');
UserRouterFactory.POST('/login', login);

function login(req, res, next) {
  const { username, password } = req.body;
  User.findOne({ username }, function(err, user) {
    console.log(user);
    !user && res.status(401).json('Information no valid');
    bcrypt
      .compare(password, user.password)
      .then(matchedPasswords => {
        console.log('matchedPasswords', matchedPasswords);
        res.status(200).json('You are loged in');
      })
      .catch(e => {
        console.log('error', e);
      });
  });
}
function cnl2(req, res, next) {
  console.log(2);
  next();
}

module.exports = userRouter;
