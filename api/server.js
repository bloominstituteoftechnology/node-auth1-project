const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);
const knex = require("../data/db-config");

const usersRouter = require("./users/users-router");
const authRouter = require("./auth/auth-router");
const server = express();

server.use(
  session({
    name: "chocolatechip",
    secret: "shhh",
    saveUninitialized: false,
    resave: false,
    store: new KnexSessionStore({
      knex,
      createTable: true,
      clearInterval: 1000 * 60 * 10,
      tablename: "sessions",
      sidfieldname: "sid",
    }),
    cookies: {
      maxAge: 100 * 60 * 10,
      secure: false,
      httpOnly: false,
    },
  })
);

server.use(express.static(path.join(__dirname, "../client")));

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api/users", usersRouter);
server.use("/api/auth", authRouter);

server.use("*", (req, res, next) => {
  next({ status: 404, message: "404 - page not found!" });
});

// eslint-disable-next-line
server.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
