const session = require('express-session');

const knexSessionStore = require('connect-session-knex')(session);

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const restricted = require('./auth/restricted-middleware.js');

// get our express routers
const usersRouter = require("./users/users-router.js");
const authRouter = require("./auth/auth-router");

// create the server object
const server = express();


const sessionConfig = {
    name: 'chocolate-chip',
    secret: 'myspeshulsecret',
    cookie: {
      maxAge: 3600 * 1000,
      secure: false, // should be true in production
      httpOnly: true
    },
    resave: false,
    saveUninitialized: false,
  
    store: new knexSessionStore(
      {
        knex: require("./database/migrations/dbConfig.js"),
        tablename: "sessions",
        sidfieldname: "sid",
        createtable: true,
        clearInterval: 3600 * 1000
      }
    )
  }


// global middleware
server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));
server.use("/api/users", restricted, usersRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;