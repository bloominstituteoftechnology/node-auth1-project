const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const restricted = require("../auth/restrictedmw.js");

const usersRouter = require("../users/user-router.js");
const authRouter = require("../auth/auth-router.js");

const server = express();

const sessionConfig = {
  name: "dcsession",
  secret: "onthelow",
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false, // should be true in production
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false,

  store: new knexSessionStore({
    knex: require("../database/Config.js"),
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
};

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use(session(sessionConfig));

server.use("/api/users", usersRouter, restricted);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;