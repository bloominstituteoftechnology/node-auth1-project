// WEB API MIDDLEWARE
// ==============================================
const express = require('express');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const cors = require('cors');
const helmet = require('helmet');

const db = require('../database/dbConfig');
const keys = require('./keys');

const sessionConfig = {
  name: 'samsisle',
  secret: [keys.sessionKey],
  cookie: {
    maxAge: 10 * 60 * 1000,
    secure: false
  },
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    tablename: 'sessions',
    sidfieldname: 'sid',
    knex: db,
    createtable: true,
    clearInterval: 60 * 60 * 1000
  })
};

module.exports = app => {
  app.use(express.json());
  app.use(session(sessionConfig));
  app.use(cors());
  app.use(helmet());
};
