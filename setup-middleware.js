const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session'); //******** */ 1. install this
const KnexSessionStore = require('connect-session-knex')(session); //<<<<< GOTCHA pass the session using currying

module.exports = server => {
  // 2. ************* create config object
  const sessionConfig = {
    name: 'something', // defaults to sid
    secret: process.env.SESSION_SECRET || 'secret word!', // to encrypt/decrypt the cookie
    cookie: {
      maxAge: 1000 * 60 * 10, // milliseconds
      secure: false, // true in production, only send cookie over https
      httpOnly: true, // JS can't access the cookie on the client
    },
    resave: false, // save the session again even if it didn't change
    saveUninitialized: true,
    // GOTCHA: remember to "new" it up
    store: new KnexSessionStore({
      knex: require('./data/dbConfig.js'),
      tablename: 'sessions',
      createtable: true,
      sidfieldname: 'sid',
      clearInterval: 1000 * 60 * 60, // deletes expired sessions every hour
    }),
  };

  server.use(helmet());
  server.use(express.json());
  server.use(cors());
  server.use(session(sessionConfig)); // 3. ************* turn sessions on
};