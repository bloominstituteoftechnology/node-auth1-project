const cors = require('cors');
const express = require('express');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const db = require('../database/dbconfig.js');

const sessionConfig = {
    name: 'cool',
    secret: 'stringnumberboolean',
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
  


module.exports = server => {

    server.use(cors());
    server.use(express.json());
    server.use(session(sessionConfig)); // wires up session management

    // server.use(protected());
  };
