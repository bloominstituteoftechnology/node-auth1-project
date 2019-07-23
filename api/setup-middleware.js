const express = require("express");
const session = require("express-session");
const helmet = require('helmet')
const cors = require("cors");

// used to persist data in DB even after server restarts
const KnexSessionStore = require('connect-session-knex')(session); // pass in session using currying
const configuredKnex = require('../database/dbConfig.js');

module.exports = server => {
  const sessionConfig = {
    name: "cookie monster", // session name to increase security
    secret: process.env.SESSION_SECRET || "mellon",
    cookie: {
      maxAge: 1000 * 60 * 10, // milliseconds, 10 min
      secure: false, // use cookie over https (development)
      httpOnly: true // false means JS can access the cookie on the client
    },
    resave: false, // avoid recreating unchanged sessions
    saveUninitialized: true, // GDPR complicance, if user does not want cookies, then false
    store: new KnexSessionStore({
      knex: configuredKnex,
      tablename: 'session',
      sidfieldname: 'sid',
      createtable: true,
      clearInterval: 1000 * 60 * 30, // deletes expired sessions every 30 min
    })
  }
  
    server.use(helmet());
    server.use(express.json());
    server.use(cors());
    server.use(session(sessionConfig));

    server.use(function(req, res, next) {
      console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
    
      next();
    });
}