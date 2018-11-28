const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const db = require('../data/dbConfig')

const restrictPath = (path = '/api/restricted') => (req, res, next) => {
  console.log(req.path)
  if (req.path.slice(0, path.length) === path) {
    if (req.session && req.session.user) {
      next();
    } else {
      res.status(401).json({message: 'Session id is required to access restricted area.'})
    }
  } else {
    next();
  }
}

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
      store: new KnexSessionStore({
        tablename: 'sessions',
        sidfieldname: 'sid',
        knex: db,
        createtable: true,
        clearInterval: 1000 * 60 * 60,
      }),
    };
    server.use(helmet());
    server.use(session(sessionConfig))
    server.use(restrictPath())
    server.use(express.json());
    // set static routes 
    server.use(express.static('./client/build'))
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