const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session")
const KnexSessionStore = require("connect-session-knex")(session)

/**
  Do what needs to be done to support sessions with the `express-session` package!
  To respect users' privacy, do NOT send them a cookie unless they log in.
  This is achieved by setting 'saveUninitialized' to false, and by not
  changing the `req.session` object unless the user authenticates.

  Users that do authenticate should have a session persisted on the server,
  and a cookie set on the client. The name of the cookie should be "chocolatechip".

  The session can be persisted in memory (would not be adequate for production)
  or you can use a session store like `connect-session-knex`.
 */

  // DEFINE ROUTER VARIABLES
const usersRouter = require("./users/users-router.js")
const authRouter = require("./auth/auth-router.js")

// INITIALIZE SERVER
const server = express();

// CREATE CONFIG OBJECT FOR SESSION
const config = {
  name:"chocolatechip",
  secret: "keep it secret, keep it safe",
  cookie:{
    maxAge: 1000 * 60 * 60,
    secure:false,
    httpOnly: true
  },
  resave:false,
  saveUninitialized:false,
  store: new KnexSessionStore({
    knex:require("../data/db-config.js"),
    tablename:"sessions",
    sidfieldname:"sid",
    createTable:true,
    clearInterval:1000 * 60 * 60
  })
}

// LETS SERVER USE DEPENDENCIES
server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(config))

// CONNECTS SERVER TO ROUTERS
server.use("/api/users", usersRouter);
server.use("/api/auth", authRouter);

// HOMEPAGE
server.get("/", (req, res) => {
  res.json({ api: "up" });
});

// CATCH ALL
server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
