const express = require('express');
const User = require('./User.model');
const routerFactory = require('../myTools/RouterFactoryClass');

const userRouter = express.Router();

const UserRouterFactory = new routerFactory(userRouter, User);
UserRouterFactory.sayHello('User');

// Create a POST for /api/register
UserRouterFactory.POST('/register');

module.exports = userRouter;
