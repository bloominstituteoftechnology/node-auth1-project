const express = require("express");
const helmet = require("helmet");
const server = express();
const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);

const usersRouter = require("./users/users-router");
const authRouter = require("./auth/auth-router");

const sessionOptions = {
  name: "john", // default sid
  secret: "keep it  a secret",
  cookie: {
    maxAge: 1000 * 60 * 60, // How long the cookie is valid in ms
    secure: false, // HTTPS is necessary for secure cookies, True in production
    httpOnly: true // Cookie cannot be accessed in js
  },
  resave: false, // Forces the session to be saved back to the session store
  saveUninitialized: false, // Forces session that is uninitialized to be saved to the store

  store: new knexSessionStore({
    knex: require("./database/db-config"),
    tablename: "session",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
};

server.use(helmet());
server.use(express.json());
server.use(session(sessionOptions));

server.use("/api/", authRouter);
server.use("/api/", usersRouter);

module.exports = server;
