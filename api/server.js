const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
// const usersRouter = require('./users/users-router')
// const authRouter = require('./auth/auth-router')
// const session = require('express-session')
// const Store = require('connect-session-knex')(session)
// const knex = require('../data/db-config')

/**
  Do what needs to be done to support sessions with the `express-session` package!
  To respect users' privacy, do NOT send them a cookie unless they log in.
  This is achieved by setting 'saveUninitialized' to false, and by not
  changing the `req.session` object unless the user authenticates.

  Users that do authenticate should have a session persisted on the server,
  and a cookie set on the client. The name of the cookie should be "chocolatechip".

  The session can be persisted in memory (would not be adecuate for production)
  or you can use a session store like `connect-session-knex`.
 */                 
const server = express();

// server.use(session({
//   name: 'chocolatechip',
//   secret: 'shh',
//   saveUninitialized: false,
//   resave: false,
//   store: new Store({
//     knex, 
//     createTable: true,
//     clearInterval: 1000 * 60 * 10,
//     tableName: 'sessions',
//     sidfieldname: 'sid'
//   }),
//   cookie: {
//     maxAge: 100 * 60 * 10,
//     secure: false,
//     httpOnly: true,
//     // sameSite: 'none'
//   }
// })
// )

server.use(helmet());
server.use(express.json());
server.use(cors());
// server.use('/api/users', usersRouter)
// server.use('/api/auth', authRouter)

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
