const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const session = require('express-session');

module.exports = {
  configureMiddleware: server => {
    const sessionConfig = {
      name: 'sessionCookie',
      secret: 'asfjaofuwruq04r3oj;ljg049fjq30j4fdsnoiwnafpi391f',
      cookie: {
        maxAge: 1000 * 60 * 10,
        secure: false, // only set it over https; in production you want this true.
      },
      httpOnly: true, // no js can touch this cookie
      resave: false,
      saveUninitialized: false,

    };
    server.use(helmet());
    server.use(session(sessionConfig))
    server.use(express.json());
    server.use(morgan('dev'));

  },
  protected: (req, res, next) => {
    if (req.session && req.session.user) {
      next();
    } else {
      res.status(401).json({message: 'Session id not found. Please login.'})
    }
  }
}