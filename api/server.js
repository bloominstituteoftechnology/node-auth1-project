const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const knexSessionStore = require('connect-session-knex')(session);

const sessionConfig = {
  name: 'vrSession',
  secret: 'my hotdog has a first name',
  cookie: {
    maxAge: 1000 * 60 *60,
    secure: false,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false,

  store: new knexSessionStore({
    knex: require('../database/dbConfig.js'),
    tableName: 'sessions',
    sidfieldname: "sid",
    createTable: true,
    clearInterval: 1000 * 60 * 60
  })
}

const usersRouter = require("../users/users-router.js");
const authRouter = require('../auth/auth-router.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use("/api/users", usersRouter);
server.use('/api/auth', authRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;