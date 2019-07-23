const express = require("express");
const session = require("express-session");
const helmet = require('helmet')
const cors = require("cors");

const KnexSessionStore = require('connect-session-knex')(session);
// used to persist data in DB even after server restarts
const configuredKnex = require('../database/dbConfig.js');

module.exports = server => {
  const sessionConfig = {
    name: "cookie monster", // session name to increase security
    secret: "mellon",
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
    server.use(express.json();
    server.use(cors());
    server.use(sessionConfig);

    server.use(function(req, res, next) {
      console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`);
    
      next();
    });

    server.use(function(req, res) {
      res
        .status(404)
        .send("This route does not exist. Return to the main directory");
    });
}