const express = require("express");
const session = require("express-session");
const KnexStore = require("connect-session-knex")(session); 

const authRouter = require("../auth/auth-router.js");
const usersRouter = require("../users/users-router.js");
const restricted = require("../auth/restricted-middleware.js");
const knex = require("../database/dbConfig.js"); 

const server = express();

const sessionConfig = {
  name: "monster",
  secret: "keep it secret, keep it safe!",
  resave: false,
  saveUninitialized: true, 
  cookie: {
    maxAge: 1000 * 60 * 10,
    secure: false,
    httpOnly: true,
  },
  store: new KnexStore({
    knex,
    tablename: "sessions",
    createtable: true,
    sidfieldname: "sid",
    clearInterval: 1000 * 60 * 15,
  }),
};


server.use(express.json());
server.use(session(sessionConfig)); 
server.use("/api/auth", authRouter);
server.use("/api/users", restricted, usersRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server; 